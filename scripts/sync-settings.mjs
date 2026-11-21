// Generates pages/settings/* from the settings schema that ships with XSOverlay.
//
// Usage: npm run settings:sync -- [path to XSOverlay install]
//
// The app defines its settings UI as Page -> Section -> Setting in
// StreamingAssets/Plugins/Applications/UserInterface/Default. This script mirrors
// that layout: one MDX page per settings tab, `##` per section, `###` per setting.
//
// Each generated block starts with a marker comment and runs to the first blank
// line (marker, heading, facts line). Everything after that blank line is
// hand-written prose and is preserved across runs.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagesDir = path.join(repoRoot, 'pages');
const settingsDir = path.join(pagesDir, 'settings');

const defaultInstallPaths = [
    'C:/Program Files (x86)/Steam/steamapps/common/XSOverlay',
    'C:/Program Files (x86)/Steam/steamapps/common/XSOverlay_Beta',
];

const installPath = process.argv[2] ?? process.env.XSOVERLAY_PATH ?? defaultInstallPaths.find(p => fs.existsSync(p));
if (!installPath || !fs.existsSync(installPath)) {
    console.error('XSOverlay install not found. Pass its path as an argument or set XSOVERLAY_PATH.');
    process.exit(1);
}

const assets = path.join(installPath, 'XSOverlay_Data', 'StreamingAssets');
const uiDir = path.join(assets, 'Plugins', 'Applications', 'UserInterface', 'Default');
const localization = JSON.parse(fs.readFileSync(path.join(assets, 'localization', 'en-US', 'ui.json'), 'utf8').replace(/^\uFEFF/, ''));

// ---------------------------------------------------------------------------
// Schema loading

const uiStub = `
const Ui = (() => {
    function Definition(type, displayName, description, defaultState, opts, opts1, parent, achievement) {
        Object.assign(this, { type, displayName, description, defaultState, opts, opts1, parent, achievement });
    }
    function Parent(name, value) { this.name = name; this.value = value; }
    return {
        ComponentType: new Proxy({}, { get: (_, key) => key }),
        Setting: Definition,
        OverlaySetting: Definition,
        ParentSetting: Parent,
        ParentAchievement: Parent,
    };
})();
`;

async function loadModule(relativePath) {
    const source = fs.readFileSync(path.join(uiDir, relativePath), 'utf8')
        .replace(/^import \* as Ui from .*$/m, uiStub);
    return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

const { SettingsLayout: globalLayout } = await loadModule('Settings/js/settings-state.js');
const { windowSettingsState } = await loadModule('WindowSettings/js/window-settings-state.js');

// ---------------------------------------------------------------------------
// Labels and formatting

const humanize = key => key.replaceAll('_', ' ');
const label = key => localization[key] ?? humanize(key);
const slugify = key => key.toLowerCase().replaceAll('_', '-');

// In-app labels that are ambiguous once flattened into page headings.
const labelOverrides = {
    NightLightStartAMPM: 'Start AM / PM',
    NightLightEndAMPM: 'End AM / PM',
};

function settingLabel(key, def) {
    return labelOverrides[key] ?? localization[key] ?? def.displayName ?? humanize(key);
}

function optionLabel(option) {
    return localization[option] ?? option;
}

function matchOption(options, value) {
    const normalized = String(value).replaceAll(' ', '');
    return options.find(option => option.replaceAll(' ', '') === normalized);
}

function formatSliderValue(value, [min, max], rawUnit) {
    const unit = rawUnit?.toLowerCase() === 'fps' ? 'FPS' : rawUnit;
    const clamped = Math.min(Math.max(value, min), max);
    if (unit === '%' && max === 1) return `${Math.round(clamped * 100)}%`;
    if (unit === 'ms') return `${Math.round(clamped * 1000)} ms`;
    const number = Number(clamped.toFixed(3));
    if (!unit) return `${number}`;
    if (unit === '°' || unit === '%') return `${number}${unit}`;
    return `${number} ${unit}`;
}

function formatDependency(parent, siblings) {
    const parentDef = siblings[parent.name];
    const parentLabel = parentDef ? settingLabel(parent.name, parentDef) : label(parent.name);
    let value;
    if (typeof parent.value === 'boolean') value = parent.value ? 'On' : 'Off';
    else if (parentDef?.type === 'Dropdown' && typeof parent.value === 'number') value = optionLabel(parentDef.opts[parent.value]);
    else value = optionLabel(String(parent.value));
    return `${parentLabel} is ${value}`;
}

// Returns SettingMeta props. `options` is a list; renderMeta decides whether to show it.
function facts(def, siblings) {
    const meta = {};
    switch (def.type) {
        case 'Toggle':
            if (typeof def.defaultState === 'boolean') meta.default = def.defaultState ? 'On' : 'Off';
            break;
        case 'Slider': {
            const [min, max] = def.opts;
            meta.default = formatSliderValue(def.defaultState, def.opts, def.opts1);
            meta.range = `${formatSliderValue(min, def.opts, def.opts1)} – ${formatSliderValue(max, def.opts, def.opts1)}`;
            break;
        }
        case 'Dropdown': {
            // Single-option dropdowns are populated at runtime (languages, microphones, sound packs).
            const isDynamic = def.opts.length <= 1;
            const defaultOption = isDynamic ? def.defaultState : matchOption(def.opts, def.defaultState) ?? def.defaultState;
            meta.default = optionLabel(defaultOption);
            if (!isDynamic) meta.options = def.opts.map(optionLabel);
            break;
        }
    }
    if (def.parent) meta.shownWhen = formatDependency(def.parent, siblings);
    if (def.achievement) meta.unlockedBy = 'an achievement';
    return meta;
}

// Options are omitted when the description already explains each one as a **bold** item.
function renderMeta(meta, body) {
    const props = { ...meta };
    if (props.options) {
        const described = props.options.every(option => body.includes(`**${option}**`));
        props.options = described ? undefined : props.options.join(', ');
    }
    const attributes = Object.entries(props)
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`);
    return attributes.length ? `<SettingMeta ${attributes.join(' ')} />` : null;
}

function inAppDescription(key, def) {
    const text = localization[`${key}_Desc`] ?? def.description;
    if (!text || text === 'desc' || text === 'description') return '';
    return text
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/?b>/gi, '**')
        .replace(/<[^>]+>/g, '')
        .split('\n').map(line => line.trim()).filter(Boolean)
        .join('\n\n');
}

// ---------------------------------------------------------------------------
// Page model: { slug, title, sections: [{ key, title, settings: [{ key, title, facts, description }] }] }

const documentedTypes = new Set(['Toggle', 'Slider', 'Dropdown', 'Button', 'ItemList']);

function buildSections(layout, sectionTitle) {
    return Object.entries(layout).map(([sectionKey, settings]) => ({
        key: sectionKey,
        title: sectionTitle(sectionKey),
        settings: Object.entries(settings)
            .filter(([, def]) => documentedTypes.has(def.type))
            .map(([key, def]) => ({
                key,
                title: settingLabel(key, def),
                facts: facts(def, settings),
                description: inAppDescription(key, def),
            })),
    }));
}

const excludedPages = new Set(['Easter_Eggs', 'Support', 'Bindings']);

const globalPages = Object.entries(globalLayout).filter(([pageKey]) => !excludedPages.has(pageKey)).map(([pageKey, sections]) => ({
    slug: slugify(pageKey),
    file: path.join(settingsDir, `${slugify(pageKey)}.mdx`),
    title: label(pageKey),
    sections: buildSections(sections, key => key === '_' ? null : label(key)),
}));

// Sections starting with "_" have no title in the app, but their settings are still shown.
const windowLayout = windowSettingsState.SettingsLayout;

// Per-overlay settings get their own page in Getting Started, outside Settings.
const overlayPage = {
    slug: 'overlays',
    file: path.join(pagesDir, 'getting-started', 'overlays.mdx'),
    title: 'Overlays',
    sections: buildSections(windowLayout, key => key.startsWith('_') ? null : label(key)),
};

// ---------------------------------------------------------------------------
// Preserving hand-written prose

const markerPattern = /^\{\/\* (page|section|setting): (.+?) \*\/\}$/;
const marker = (kind, key) => `{/* ${kind}: ${key} */}`;

function readExisting(file) {
    const result = { preamble: '', bodies: new Map() };
    if (!fs.existsSync(file)) return result;

    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    const markerIndices = lines.flatMap((line, i) => markerPattern.test(line) ? [i] : []);
    result.preamble = lines.slice(0, markerIndices[0] ?? lines.length).join('\n').trim();

    markerIndices.forEach((start, n) => {
        const [, kind, key] = lines[start].match(markerPattern);
        const chunk = lines.slice(start + 1, markerIndices[n + 1] ?? lines.length);
        const headerEnd = chunk.findIndex(line => line.trim() === '');
        const body = headerEnd === -1 ? '' : chunk.slice(headerEnd + 1).join('\n').trim();
        result.bodies.set(`${kind}:${key}`, body);
    });
    return result;
}

const todo = '{/* TODO: describe this setting */}';

function renderPage(page, existing, report) {
    const out = [];
    const block = (header, id, seed = '') => {
        const body = existing.bodies.has(id) ? existing.bodies.get(id) : seed;
        existing.bodies.delete(id);
        out.push(...(typeof header === 'function' ? header(body) : header), '');
        if (body) out.push(body, '');
        return body;
    };

    if (existing.preamble) out.push(existing.preamble, '');
    block([marker('page', page.slug), `# ${page.title}`], `page:${page.slug}`);

    for (const section of page.sections) {
        if (section.title) block([marker('section', section.key), `## ${section.title}`], `section:${section.key}`);

        for (const setting of section.settings) {
            const header = body => [marker('setting', setting.key), `### ${setting.title}`, renderMeta(setting.facts, body)].filter(Boolean);
            const body = block(header, `setting:${setting.key}`, setting.description || todo);
            if (body === todo) report.undocumented.push(`${page.slug}: ${setting.title}`);
        }
    }

    for (const [id, body] of existing.bodies) {
        if (body) report.removed.push(`${page.slug}: ${id}\n${body}`);
    }

    return out.join('\n').trimEnd() + '\n';
}

// ---------------------------------------------------------------------------
// Write

const pages = [...globalPages, overlayPage];
const report = { undocumented: [], removed: [] };

fs.mkdirSync(settingsDir, { recursive: true });
for (const page of pages) {
    fs.writeFileSync(page.file, renderPage(page, readExisting(page.file), report));
}

const meta = Object.fromEntries(globalPages.map(page => [page.slug, page.title]));
fs.writeFileSync(path.join(settingsDir, '_meta.json'), JSON.stringify(meta, null, 2) + '\n');

console.log(`Synced ${pages.length} pages from ${installPath}`);
if (report.undocumented.length) {
    console.log(`\n${report.undocumented.length} settings have no description:`);
    report.undocumented.forEach(line => console.log(`  ${line}`));
}
if (report.removed.length) {
    console.log('\nProse dropped for settings no longer in the app:');
    report.removed.forEach(line => console.log(`  ${line.replaceAll('\n', '\n    ')}`));
}
