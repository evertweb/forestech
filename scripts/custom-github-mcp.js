#!/usr/bin/env node

// custom-github-mcp.js
// Servidor MCP personalizado que integra GitHub CLI

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class GitHubMCPServer extends Server {
  constructor() {
    super(
      {
        name: 'github-cli-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.setRequestHandler('tools/list', async () => {
      return {
        tools: [
          {
            name: 'gh_repo_info',
            description: 'Obtiene información del repositorio actual',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'gh_pr_list',
            description: 'Lista PRs usando GitHub CLI',
            inputSchema: {
              type: 'object',
              properties: {
                state: { type: 'string', enum: ['open', 'closed', 'merged', 'all'] },
                limit: { type: 'number', default: 10 }
              }
            }
          },
          {
            name: 'gh_pr_view',
            description: 'Ver detalles de un PR específico',
            inputSchema: {
              type: 'object',
              properties: {
                number: { type: 'number' }
              },
              required: ['number']
            }
          },
          {
            name: 'gh_commits_recent',
            description: 'Obtiene commits recientes',
            inputSchema: {
              type: 'object',
              properties: {
                limit: { type: 'number', default: 10 }
              }
            }
          },
          {
            name: 'gh_branch_status',
            description: 'Estado de la branch actual',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'gh_pr_create',
            description: 'Crea un PR usando GitHub CLI',
            inputSchema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                body: { type: 'string' },
                base: { type: 'string' }
              },
              required: ['title']
            }
          }
        ]
      };
    });

    this.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'gh_repo_info':
            const { stdout: repoInfo } = await execAsync('gh repo view --json name,owner,defaultBranchRef,description,pushedAt');
            return {
              content: [
                {
                  type: 'text',
                  text: `Información del repositorio:\n${JSON.stringify(JSON.parse(repoInfo), null, 2)}`
                }
              ]
            };

          case 'gh_pr_list':
            const state = args.state || 'open';
            const limit = args.limit || 10;
            const { stdout: prList } = await execAsync(`gh pr list --state ${state} --limit ${limit} --json number,title,author,state,createdAt`);
            return {
              content: [
                {
                  type: 'text',
                  text: `PRs (${state}):\n${JSON.stringify(JSON.parse(prList), null, 2)}`
                }
              ]
            };

          case 'gh_pr_view':
            const prNumber = args.number;
            const { stdout: prDetails } = await execAsync(`gh pr view ${prNumber} --json number,title,body,author,state,mergeable,reviews`);
            return {
              content: [
                {
                  type: 'text',
                  text: `Detalles PR #${prNumber}:\n${JSON.stringify(JSON.parse(prDetails), null, 2)}`
                }
              ]
            };

          case 'gh_commits_recent':
            const commitLimit = args.limit || 10;
            const { stdout: commits } = await execAsync(`git log --oneline -${commitLimit} --pretty=format:'{"hash":"%h","message":"%s","author":"%an","date":"%ad"}' --date=iso`);
            const commitLines = commits.split('\n').filter(line => line.trim());
            const commitsArray = commitLines.map(line => {
              try {
                return JSON.parse(line);
              } catch {
                return { message: line };
              }
            });
            return {
              content: [
                {
                  type: 'text',
                  text: `Commits recientes:\n${JSON.stringify(commitsArray, null, 2)}`
                }
              ]
            };

          case 'gh_branch_status':
            const { stdout: branchStatus } = await execAsync('git status --porcelain -b');
            const { stdout: currentBranch } = await execAsync('git branch --show-current');
            return {
              content: [
                {
                  type: 'text',
                  text: `Estado de la branch:\nBranch actual: ${currentBranch.trim()}\nEstado:\n${branchStatus}`
                }
              ]
            };

          case 'gh_pr_create':
            const title = args.title;
            const body = args.body || '';
            const base = args.base || 'main';
            const createCmd = `gh pr create --title "${title}" --body "${body}" --base ${base}`;
            const { stdout: createOut } = await execAsync(createCmd);
            return {
              content: [
                {
                  type: 'text',
                  text: `PR creado:\n${createOut}`
                }
              ]
            };

          default:
            throw new Error(`Herramienta desconocida: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error ejecutando ${name}: ${error.message}`
            }
          ]
        };
      }
    });
  }
}

async function main() {
  const server = new GitHubMCPServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (require.main === module) {
  main().catch(console.error);
}
