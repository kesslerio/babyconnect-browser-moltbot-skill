// Baby Connect Resolver
// Preprocesses snippet templates before browser.evaluate execution
// Usage: const snippet = resolveSnippet(readFile('snippets/bottle.js'), 'child_a');

const fs = require('fs');
const path = require('path');

// Default config file location (relative to skill directory)
const CONFIG_FILE = '.children.yaml';

/**
 * Simple YAML parser for .children.yaml structure
 * More robust than regex-based parsing
 * @param {string} content - YAML file content
 * @returns {object} - Parsed config
 */
function parseChildrenYaml(content) {
  const result = { default: null, list: {} };
  
  // Remove comments for simpler parsing
  const lines = content.split('\n').filter(l => !l.trim().startsWith('#'));
  
  let currentSection = null;
  let currentChild = null;
  
  for (const line of lines) {
    const trimmed = line.replace(/#.*/, '').trim(); // Strip inline comments
    if (!trimmed) continue;
    
    // Top-level keys
    if (trimmed.startsWith('default:')) {
      result.default = trimmed.split(':')[1].trim().replace(/"/g, '');
      continue;
    }
    
    // Child key (e.g., "child_a:")
    if (/^[a-zA-Z0-9_-]+:$/.test(trimmed)) {
      currentChild = trimmed.replace(':', '').trim();
      result.list[currentChild] = { label: currentChild, id_env: '', default_unit: 'ml', aliases: [] };
      currentSection = null;
      continue;
    }
    
    // Nested keys under a child
    if (currentChild && result.list[currentChild]) {
      if (trimmed.startsWith('label:')) {
        result.list[currentChild].label = trimmed.split(':')[1].trim().replace(/"/g, '');
      } else if (trimmed.startsWith('id_env:')) {
        result.list[currentChild].id_env = trimmed.split(':')[1].trim().replace(/"/g, '');
      } else if (trimmed.startsWith('default_unit:')) {
        result.list[currentChild].default_unit = trimmed.split(':')[1].trim().replace(/"/g, '');
      } else if (trimmed.startsWith('aliases:')) {
        currentSection = 'aliases';
      } else if (currentSection === 'aliases' && trimmed.startsWith('-')) {
        result.list[currentChild].aliases.push(trimmed.replace('-', '').trim().replace(/"/g, ''));
      } else if (trimmed.length > 0 && !trimmed.startsWith('-')) {
        currentSection = null;
      }
    }
  }
  
  return result;
}

/**
 * Resolve child config from YAML file
 * @param {string} configPath - Path to .children.yaml
 * @param {string} childKey - Key like 'child_a' or 'child_b'
 * @returns {object|null} - Child config or null if not found
 */
function loadChildConfig(configPath, childKey) {
  try {
    if (!fs.existsSync(configPath)) {
      throw new Error(`Config file not found: ${configPath}`);
    }
    
    const content = fs.readFileSync(configPath, 'utf-8');
    const config = parseChildrenYaml(content);
    
    // Find child by key (exact match or alias)
    let matchedKey = null;
    
    if (config.list[childKey]) {
      matchedKey = childKey;
    } else {
      // Try to find by alias
      for (const [key, child] of Object.entries(config.list)) {
        if (child.aliases && child.aliases.includes(childKey)) {
          matchedKey = key;
          break;
        }
        if (child.label && child.label.toLowerCase() === childKey.toLowerCase()) {
          matchedKey = key;
          break;
        }
      }
    }
    
    if (matchedKey && config.list[matchedKey] && config.list[matchedKey].id_env) {
      return config.list[matchedKey];
    }
    
    return null;
  } catch (e) {
    throw new Error(`Failed to load child config: ${e.message}`);
  }
}

/**
 * Get environment variable value
 * @param {string} key - Environment variable name
 * @param {object} env - Environment object (use passed env, fall back to process.env)
 * @returns {string|null} - Value or null if not set
 */
function getEnvVar(key, env = process.env) {
  return env[key] || null;
}

/**
 * Resolve placeholders in a snippet template
 * @param {string} template - Snippet template with ${VAR} placeholders
 * @param {object} replacements - Key-value pairs for replacement
 * @returns {string} - Resolved snippet
 */
function resolveTemplate(template, replacements) {
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    // Escape special regex characters in key
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(`\\$\\{${escapedKey}\\}`, 'g'), value || '');
  }
  return result;
}

/**
 * Main resolver function
 * @param {string} snippetTemplate - Raw snippet content or path
 * @param {string} childKey - Child to resolve (e.g., 'child_a')
 * @param {object} options - Options
 * @returns {string} - Resolved snippet ready for browser.evaluate
 */
function resolveSnippet(snippetTemplate, childKey, options = {}) {
  const {
    configPath = options.configDir 
      ? path.join(options.configDir, CONFIG_FILE)
      : path.join(process.cwd(), 'skills', 'babyconnect-browser', CONFIG_FILE),
    env = process.env
  } = options;

  // If snippetTemplate looks like a path, read the file
  let template = snippetTemplate;
  if (!snippetTemplate.includes('//') && !snippetTemplate.includes('(async')) {
    try {
      template = fs.readFileSync(snippetTemplate, 'utf-8');
    } catch (e) {
      // Not a path, use as-is
    }
  }

  // Load child config
  const childConfig = loadChildConfig(configPath, childKey);
  if (!childConfig) {
    throw new Error(`ERR: Child config not found for key: ${childKey}`);
  }

  // Get actual ID from environment (use passed env if provided)
  const childId = getEnvVar(childConfig.id_env, env);
  if (!childId) {
    throw new Error(`ERR: Missing env var ${childConfig.id_env}`);
  }

  // Build replacements - only substitute the specific placeholder for this child
  const replacements = {
    'CHILD_ID': childId // Always available
  };
  
  // Add the specific env var placeholder for this child
  if (childConfig.id_env) {
    replacements[childConfig.id_env] = childId;
  }
  
  // Add fallback placeholders based on child type
  if (childKey === 'child_a' || childConfig.default_unit === 'ml') {
    replacements['BABYCONNECT_CHILD_A_ID'] = childId;
  }
  if (childKey === 'child_b' || childConfig.default_unit === 'oz') {
    replacements['BABYCONNECT_CHILD_B_ID'] = childId;
  }

  // Resolve template
  return resolveTemplate(template, replacements);
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node resolve-children.js <snippet-path> <child-key>');
    console.error('Example: node resolve-children.js snippets/bottle.js child_a');
    process.exit(1);
  }

  try {
    const resolved = resolveSnippet(args[0], args[1]);
    console.log(resolved);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

module.exports = { resolveSnippet, loadChildConfig, getEnvVar, resolveTemplate, parseChildrenYaml };
