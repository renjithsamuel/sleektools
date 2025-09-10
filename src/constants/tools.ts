import { Tool, ToolCategory } from '../types/tools';

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'formatters',
    name: 'Formatters',
    description: 'Format and beautify your code and data',
    color: '#4F46E5',
    icon: 'FaCode',
  },
  {
    id: 'validators',
    name: 'Validators',
    description: 'Validate syntax and structure',
    color: '#059669',
    icon: 'FaCheckCircle',
  },
  {
    id: 'converters',
    name: 'Converters',
    description: 'Convert between different formats',
    color: '#DC2626',
    icon: 'FaExchangeAlt',
  },
  {
    id: 'generators',
    name: 'Generators',
    description: 'Generate IDs, tokens, and more',
    color: '#7C2D12',
    icon: 'FaRandom',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    description: 'Helpful development utilities',
    color: '#1F2937',
    icon: 'FaTools',
  },
];

export const TOOLS: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON',
    icon: 'FaCubes',
    category: TOOL_CATEGORIES[0], // formatters
    route: '/formatters/json',
    featured: true,
  },
  {
    id: 'text-compare',
    name: 'Text Compare',
    description: 'Compare two text blocks and see differences',
    icon: 'FaEquals',
    category: TOOL_CATEGORIES[4], // utilities
    route: '/utilities/text-compare',
    featured: true,
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings',
    icon: 'FaLock',
    category: TOOL_CATEGORIES[2], // converters
    route: '/converters/base64',
    featured: true,
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries',
    icon: 'FaDatabase',
    category: TOOL_CATEGORIES[0], // formatters
    route: '/formatters/sql',
  },
  {
    id: 'sql-validator',
    name: 'SQL Validator',
    description: 'Validate SQL syntax and structure',
    icon: 'FaCheckCircle',
    category: TOOL_CATEGORIES[1], // validators
    route: '/validators/sql',
  },
  {
    id: 'swagger-viewer',
    name: 'Swagger Viewer',
    description: 'View and validate OpenAPI/Swagger specifications',
    icon: 'FaEye',
    category: TOOL_CATEGORIES[1], // validators
    route: '/validators/swagger',
  },
  {
    id: 'yaml-validator',
    name: 'YAML Validator',
    description: 'Validate and format YAML files',
    icon: 'FaFileCode',
    category: TOOL_CATEGORIES[1], // validators
    route: '/validators/yaml',
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    description: 'Format and validate XML documents',
    icon: 'FaFileAlt',
    category: TOOL_CATEGORIES[0], // formatters
    route: '/formatters/xml',
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and validate JSON Web Tokens',
    icon: 'FaKey',
    category: TOOL_CATEGORIES[1], // validators
    route: '/validators/jwt',
    featured: true,
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress and convert images',
    icon: 'FaCompress',
    category: TOOL_CATEGORIES[2], // converters
    route: '/converters/image',
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate various types of UUIDs',
    icon: 'FaIdCard',
    category: TOOL_CATEGORIES[3], // generators
    route: '/generators/uuid',
    featured: true,
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert Unix timestamps to readable dates',
    icon: 'FaClock',
    category: TOOL_CATEGORIES[2], // converters
    route: '/converters/timestamp',
  },
  {
    id: 'code-editor',
    name: 'Online Code Editor',
    description: 'Professional code editor with syntax highlighting and execution',
    icon: 'FaCode',
    category: TOOL_CATEGORIES[4], // utilities
    route: '/utilities/code-editor',
    featured: true,
  },
  {
    id: 'css-formatter',
    name: 'CSS Formatter',
    description: 'Format and beautify CSS code with customizable options',
    icon: 'FaPaintBrush',
    category: TOOL_CATEGORIES[0], // formatters
    route: '/formatters/css',
  },
  {
    id: 'lorem-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text in multiple styles and formats',
    icon: 'FaParagraph',
    category: TOOL_CATEGORIES[3], // generators
    route: '/generators/lorem',
  },
];

export const getFeaturedTools = (): Tool[] => TOOLS.filter(tool => tool.featured);

export const getToolsByCategory = (categoryId: string): Tool[] =>
  TOOLS.filter(tool => tool.category.id === categoryId);

export const getToolById = (id: string): Tool | undefined => TOOLS.find(tool => tool.id === id);

export const searchTools = (query: string): Tool[] =>
  TOOLS.filter(
    tool =>
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase())
  );
