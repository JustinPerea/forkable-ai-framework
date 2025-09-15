#!/bin/bash

# Forkable AI Framework - Multi-Agent Coordination Script
# This script helps coordinate between different specialized agents

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SPECS_DIR="$PROJECT_ROOT/specs"
PLANNING_DIR="$PROJECT_ROOT/planning"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to display help
show_help() {
    cat << EOF
Forkable AI Framework - Multi-Agent Coordination Script

USAGE:
    $0 [COMMAND] [OPTIONS]

COMMANDS:
    status              Show current project status
    sync                Sync all agent progress
    validate            Validate specifications and implementations
    deploy              Deploy to staging environment
    test                Run comprehensive tests
    docs                Generate documentation
    help                Show this help message

OPTIONS:
    -v, --verbose       Enable verbose output
    -q, --quiet         Suppress non-error output
    -f, --force         Force operation without confirmation

EXAMPLES:
    $0 status                    # Show project status
    $0 sync --verbose           # Sync with verbose output
    $0 validate --force         # Validate without confirmation
    $0 deploy staging           # Deploy to staging

EOF
}

# Function to check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if required tools are installed
    local missing_tools=()
    
    if ! command -v node &> /dev/null; then
        missing_tools+=("node")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing_tools+=("npm")
    fi
    
    if ! command -v git &> /dev/null; then
        missing_tools+=("git")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        error "Missing required tools: ${missing_tools[*]}"
        error "Please install the missing tools and try again."
        exit 1
    fi
    
    # Check if project structure exists
    if [ ! -d "$SPECS_DIR" ]; then
        error "Specs directory not found: $SPECS_DIR"
        exit 1
    fi
    
    if [ ! -d "$PLANNING_DIR" ]; then
        error "Planning directory not found: $PLANNING_DIR"
        exit 1
    fi
    
    success "Prerequisites check passed"
}

# Function to show project status
show_status() {
    log "Project Status Report"
    echo "===================="
    
    # Check specification status
    echo -e "\n${BLUE}Specifications:${NC}"
    for spec in "$SPECS_DIR"/*/; do
        if [ -d "$spec" ]; then
            spec_name=$(basename "$spec")
            spec_file="$spec/spec.md"
            plan_file="$spec/plan.md"
            
            if [ -f "$spec_file" ]; then
                status=$(grep "Status:" "$spec_file" | cut -d' ' -f2- | tr -d '[]')
                echo "  $spec_name: $status"
            else
                echo "  $spec_name: No specification found"
            fi
            
            if [ -f "$plan_file" ]; then
                plan_status=$(grep "Status:" "$plan_file" | cut -d' ' -f2- | tr -d '[]')
                echo "    Plan: $plan_status"
            else
                echo "    Plan: No plan found"
            fi
        fi
    done
    
    # Check implementation status
    echo -e "\n${BLUE}Implementation:${NC}"
    if [ -d "$PROJECT_ROOT/backend" ]; then
        echo "  Backend: $(cd "$PROJECT_ROOT/backend" && git rev-parse --short HEAD 2>/dev/null || echo "No git")"
    else
        echo "  Backend: Not found"
    fi
    
    if [ -d "$PROJECT_ROOT/frontend" ]; then
        echo "  Frontend: $(cd "$PROJECT_ROOT/frontend" && git rev-parse --short HEAD 2>/dev/null || echo "No git")"
    else
        echo "  Frontend: Not found"
    fi
    
    if [ -d "$PROJECT_ROOT/mobile" ]; then
        echo "  Mobile: $(cd "$PROJECT_ROOT/mobile" && git rev-parse --short HEAD 2>/dev/null || echo "No git")"
    else
        echo "  Mobile: Not found"
    fi
    
    # Check environment status
    echo -e "\n${BLUE}Environment:${NC}"
    if [ -f "$PROJECT_ROOT/backend/.env" ]; then
        echo "  Backend Environment: Configured"
    else
        echo "  Backend Environment: Not configured"
    fi
    
    if [ -f "$PROJECT_ROOT/mobile/.env" ]; then
        echo "  Mobile Environment: Configured"
    else
        echo "  Mobile Environment: Not configured"
    fi
}

# Function to sync agent progress
sync_progress() {
    log "Syncing agent progress..."
    
    # Update specifications
    for spec in "$SPECS_DIR"/*/; do
        if [ -d "$spec" ]; then
            spec_name=$(basename "$spec")
            log "Syncing $spec_name..."
            
            # Check for updates in specification
            if [ -f "$spec/spec.md" ]; then
                # Update last modified date
                sed -i "s/Date: .*/Date: $(date +'%Y-%m-%d')/" "$spec/spec.md"
            fi
            
            # Check for updates in plan
            if [ -f "$spec/plan.md" ]; then
                # Update last modified date
                sed -i "s/Date: .*/Date: $(date +'%Y-%m-%d')/" "$spec/plan.md"
            fi
        fi
    done
    
    # Update coordination document
    if [ -f "$PLANNING_DIR/AGENT_COORDINATION_STRATEGY.md" ]; then
        sed -i "s/Last Updated: .*/Last Updated: $(date +'%Y-%m-%d %H:%M:%S')/" "$PLANNING_DIR/AGENT_COORDINATION_STRATEGY.md"
    fi
    
    success "Agent progress synced"
}

# Function to validate specifications
validate_specifications() {
    log "Validating specifications..."
    
    local validation_errors=0
    
    # Check each specification
    for spec in "$SPECS_DIR"/*/; do
        if [ -d "$spec" ]; then
            spec_name=$(basename "$spec")
            log "Validating $spec_name..."
            
            # Check required files
            local required_files=("spec.md" "plan.md")
            for file in "${required_files[@]}"; do
                if [ ! -f "$spec/$file" ]; then
                    error "Missing required file: $spec/$file"
                    ((validation_errors++))
                fi
            done
            
            # Check specification content
            if [ -f "$spec/spec.md" ]; then
                # Check for required sections
                local required_sections=("Overview" "Requirements" "Technical Design" "Implementation Details")
                for section in "${required_sections[@]}"; do
                    if ! grep -q "## $section" "$spec/spec.md"; then
                        error "Missing required section in $spec_name: $section"
                        ((validation_errors++))
                    fi
                done
            fi
            
            # Check plan content
            if [ -f "$spec/plan.md" ]; then
                # Check for required sections
                local required_sections=("Overview" "Implementation Strategy" "Implementation Phases" "Resource Requirements")
                for section in "${required_sections[@]}"; do
                    if ! grep -q "## $section" "$spec/plan.md"; then
                        error "Missing required section in $spec_name plan: $section"
                        ((validation_errors++))
                    fi
                done
            fi
        fi
    done
    
    if [ $validation_errors -eq 0 ]; then
        success "All specifications validated successfully"
    else
        error "Validation failed with $validation_errors errors"
        exit 1
    fi
}

# Function to run tests
run_tests() {
    log "Running comprehensive tests..."
    
    # Test backend
    if [ -d "$PROJECT_ROOT/backend" ]; then
        log "Testing backend..."
        cd "$PROJECT_ROOT/backend"
        if [ -f "package.json" ]; then
            npm test || {
                error "Backend tests failed"
                exit 1
            }
        else
            warning "No package.json found in backend"
        fi
    fi
    
    # Test frontend
    if [ -d "$PROJECT_ROOT/frontend" ]; then
        log "Testing frontend..."
        cd "$PROJECT_ROOT/frontend"
        if [ -f "package.json" ]; then
            npm test || {
                error "Frontend tests failed"
                exit 1
            }
        else
            warning "No package.json found in frontend"
        fi
    fi
    
    # Test mobile
    if [ -d "$PROJECT_ROOT/mobile" ]; then
        log "Testing mobile..."
        cd "$PROJECT_ROOT/mobile"
        if [ -f "package.json" ]; then
            npm test || {
                error "Mobile tests failed"
                exit 1
            }
        else
            warning "No package.json found in mobile"
        fi
    fi
    
    success "All tests passed"
}

# Function to generate documentation
generate_docs() {
    log "Generating documentation..."
    
    # Generate API documentation
    if [ -d "$PROJECT_ROOT/backend" ]; then
        log "Generating API documentation..."
        cd "$PROJECT_ROOT/backend"
        if [ -f "package.json" ] && grep -q "jsdoc" package.json; then
            npm run docs || warning "API documentation generation failed"
        else
            warning "JSDoc not configured in backend"
        fi
    fi
    
    # Generate project documentation
    log "Generating project documentation..."
    cat > "$PROJECT_ROOT/README.md" << EOF
# Forkable AI Framework

A comprehensive forkable AI application framework that enables rapid deployment of AI-powered applications through configuration-driven development.

## Project Status

$(show_status)

## Architecture

- **Backend**: Node.js + Express.js with multi-provider AI integration
- **Frontend**: Vanilla HTML/CSS/JavaScript with modern UI
- **Mobile**: React Native + Expo for iOS/Android
- **Infrastructure**: Vercel hosting with Postgres and Redis

## Quick Start

1. Clone the repository
2. Set up environment variables
3. Install dependencies
4. Start development servers

## Documentation

- [Project Constitution](planning/memory/constitution.md)
- [Strategic Development Plan](planning/STRATEGIC_DEVELOPMENT_PLAN.md)
- [Agent Coordination Strategy](planning/AGENT_COORDINATION_STRATEGY.md)

## Specifications

$(find specs -name "spec.md" -exec basename {} \; | sed 's/spec.md//' | sed 's/^/- /')

## Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) before contributing.

## License

MIT License - see [LICENSE](LICENSE) for details.
EOF
    
    success "Documentation generated"
}

# Function to deploy to staging
deploy_staging() {
    log "Deploying to staging environment..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        error "Vercel CLI not found. Please install it with: npm install -g vercel"
        exit 1
    fi
    
    # Deploy backend
    if [ -d "$PROJECT_ROOT/backend" ]; then
        log "Deploying backend to staging..."
        cd "$PROJECT_ROOT/backend"
        vercel --env=staging || {
            error "Backend deployment failed"
            exit 1
        }
    fi
    
    # Deploy frontend
    if [ -d "$PROJECT_ROOT/frontend" ]; then
        log "Deploying frontend to staging..."
        cd "$PROJECT_ROOT/frontend"
        vercel --env=staging || {
            error "Frontend deployment failed"
            exit 1
        }
    fi
    
    success "Deployment to staging completed"
}

# Main function
main() {
    # Parse command line arguments
    local command=""
    local verbose=false
    local quiet=false
    local force=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -v|--verbose)
                verbose=true
                shift
                ;;
            -q|--quiet)
                quiet=true
                shift
                ;;
            -f|--force)
                force=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                if [ -z "$command" ]; then
                    command="$1"
                else
                    error "Unknown option: $1"
                    show_help
                    exit 1
                fi
                shift
                ;;
        esac
    done
    
    # Set log level
    if [ "$quiet" = true ]; then
        exec 2>/dev/null
    fi
    
    # Check prerequisites
    check_prerequisites
    
    # Execute command
    case $command in
        status)
            show_status
            ;;
        sync)
            sync_progress
            ;;
        validate)
            validate_specifications
            ;;
        test)
            run_tests
            ;;
        docs)
            generate_docs
            ;;
        deploy)
            deploy_staging
            ;;
        help|"")
            show_help
            ;;
        *)
            error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
