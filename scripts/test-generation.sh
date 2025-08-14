#!/bin/bash

# Comprehensive testing script for ShiftPilot schedule generation
# This script tests the full pipeline from seeding to generation to validation

set -e # Exit on any error

BASE_URL="http://localhost:3001"
API_URL="$BASE_URL/api/test"

echo "🚀 Starting ShiftPilot Generation Testing Pipeline"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if server is running
check_server() {
    log_step "Checking if development server is running..."
    if curl -s "$BASE_URL/auth/login" > /dev/null; then
        log_success "Server is running"
    else
        log_error "Server is not running. Please start with 'pnpm dev'"
        exit 1
    fi
}

# Function to seed database
seed_database() {
    log_step "Seeding database with real radiology data..."
    
    response=$(curl -s -w "%{http_code}" -X POST "$API_URL/seed" -o /tmp/seed_response.json)
    http_code="${response: -3}"
    
    if [ "$http_code" -eq 200 ]; then
        log_success "Database seeded successfully"
        
        # Extract organization ID from response
        ORG_ID=$(cat /tmp/seed_response.json | grep -o '"organizationId":"[^"]*' | cut -d'"' -f4)
        if [ -n "$ORG_ID" ]; then
            log_success "Organization ID: $ORG_ID"
            echo $ORG_ID > /tmp/org_id.txt
        else
            log_error "Could not extract organization ID"
            exit 1
        fi
        
        # Show seeding stats
        echo "Seeding Results:"
        cat /tmp/seed_response.json | grep -o '"[a-zA-Z]*Count":[0-9]*' | sed 's/"//g' | sed 's/:/: /'
        
    else
        log_error "Database seeding failed (HTTP $http_code)"
        cat /tmp/seed_response.json
        exit 1
    fi
}

# Function to generate schedule
generate_schedule() {
    local year=${1:-2025}
    local month=${2:-1}
    
    log_step "Generating schedule for $year-$month..."
    
    ORG_ID=$(cat /tmp/org_id.txt)
    
    payload=$(cat << EOF
{
    "organizationId": "$ORG_ID",
    "year": $year,
    "month": $month,
    "seed": 42
}
EOF
    )
    
    response=$(curl -s -w "%{http_code}" -X POST "$API_URL/generate" \
        -H "Content-Type: application/json" \
        -d "$payload" \
        -o /tmp/generate_response.json)
    
    http_code="${response: -3}"
    
    if [ "$http_code" -eq 200 ]; then
        log_success "Schedule generated successfully"
        
        # Extract metrics
        echo "Generation Metrics:"
        cat /tmp/generate_response.json | grep -o '"[a-zA-Z]*Instances":[0-9]*' | sed 's/"//g' | sed 's/:/: /'
        cat /tmp/generate_response.json | grep -o '"[a-zA-Z]*Score":[0-9.]*' | sed 's/"//g' | sed 's/:/: /'
        cat /tmp/generate_response.json | grep -o '"executionTimeMs":[0-9]*' | sed 's/"//g' | sed 's/:/: /'
        
    else
        log_error "Schedule generation failed (HTTP $http_code)"
        cat /tmp/generate_response.json
        exit 1
    fi
}

# Function to view generated schedule
view_schedule() {
    local year=${1:-2025}
    local month=${2:-1}
    
    log_step "Fetching generated schedule for $year-$month..."
    
    ORG_ID=$(cat /tmp/org_id.txt)
    
    response=$(curl -s -w "%{http_code}" "$API_URL/schedule/$ORG_ID/$year/$month" \
        -o /tmp/schedule_response.json)
    
    http_code="${response: -3}"
    
    if [ "$http_code" -eq 200 ]; then
        log_success "Schedule fetched successfully"
        
        # Show schedule stats
        echo "Schedule Statistics:"
        cat /tmp/schedule_response.json | grep -A 10 '"stats":' | grep -o '"[a-zA-Z]*Instances":[0-9]*' | sed 's/"//g' | sed 's/:/: /'
        
        # Show workload distribution  
        echo ""
        echo "Workload Distribution:"
        cat /tmp/schedule_response.json | grep -A 50 '"assignmentsByUser":' | grep -o '"[^"]*":[0-9]*' | head -20 | sed 's/"//g' | sed 's/:/: /'
        
        # Save schedule for detailed analysis
        cat /tmp/schedule_response.json > /tmp/final_schedule.json
        
    else
        log_error "Failed to fetch schedule (HTTP $http_code)"
        cat /tmp/schedule_response.json
        exit 1
    fi
}

# Function to validate schedule quality
validate_schedule() {
    log_step "Validating schedule quality..."
    
    if [ ! -f /tmp/final_schedule.json ]; then
        log_error "No schedule file found for validation"
        return 1
    fi
    
    # Extract key metrics
    total=$(cat /tmp/final_schedule.json | grep -o '"totalInstances":[0-9]*' | cut -d':' -f2)
    assigned=$(cat /tmp/final_schedule.json | grep -o '"assignedInstances":[0-9]*' | cut -d':' -f2)
    unassigned=$(cat /tmp/final_schedule.json | grep -o '"unassignedInstances":[0-9]*' | cut -d':' -f2)
    
    if [ -n "$total" ] && [ -n "$assigned" ] && [ -n "$unassigned" ]; then
        coverage=$(echo "scale=2; $assigned * 100 / $total" | bc -l)
        
        echo "Validation Results:"
        echo "  Total Shifts: $total"
        echo "  Assigned: $assigned"
        echo "  Unassigned: $unassigned" 
        echo "  Coverage: ${coverage}%"
        
        # Validate coverage threshold
        if (( $(echo "$coverage >= 85" | bc -l) )); then
            log_success "Schedule coverage is acceptable (${coverage}%)"
        else
            log_warning "Schedule coverage is low (${coverage}%). Expected >85%"
        fi
        
        # Check for reasonable workload distribution
        max_workload=$(cat /tmp/final_schedule.json | grep -A 50 '"assignmentsByUser":' | grep -o ':[0-9]*' | cut -d':' -f2 | sort -nr | head -1)
        min_workload=$(cat /tmp/final_schedule.json | grep -A 50 '"assignmentsByUser":' | grep -o ':[0-9]*' | cut -d':' -f2 | sort -n | head -1)
        
        if [ -n "$max_workload" ] && [ -n "$min_workload" ]; then
            workload_ratio=$(echo "scale=2; $max_workload / $min_workload" | bc -l)
            echo "  Workload Ratio (max/min): $workload_ratio"
            
            if (( $(echo "$workload_ratio <= 3" | bc -l) )); then
                log_success "Workload distribution is reasonable (ratio: $workload_ratio)"
            else
                log_warning "Workload distribution is uneven (ratio: $workload_ratio)"
            fi
        fi
        
    else
        log_error "Could not extract metrics for validation"
        return 1
    fi
}

# Function to run pattern analysis
analyze_patterns() {
    log_step "Analyzing schedule patterns..."
    
    if [ ! -f /tmp/final_schedule.json ]; then
        log_error "No schedule file found for pattern analysis"
        return 1
    fi
    
    echo "Pattern Analysis:"
    
    # Count assignments by subspecialty  
    echo "Assignments by Subspecialty:"
    cat /tmp/final_schedule.json | grep -o '"subspecialty":"[^"]*"' | sort | uniq -c | head -10
    
    # Count shifts by type
    echo ""
    echo "Most Common Shift Types:"
    cat /tmp/final_schedule.json | grep -o '"shiftCode":"[^"]*"' | sort | uniq -c | sort -nr | head -10
    
    # Look for constraint violations (simplified)
    neuro_violations=$(cat /tmp/final_schedule.json | grep -A 3 -B 3 '"shiftName":".*Neuro.*"' | grep -v '"subspecialty":"Neuroradiology"' | wc -l)
    
    if [ "$neuro_violations" -eq 0 ]; then
        log_success "No obvious neuro constraint violations detected"
    else
        log_warning "$neuro_violations potential neuro constraint violations detected"
    fi
}

# Function to cleanup
cleanup() {
    log_step "Cleaning up temporary files..."
    rm -f /tmp/seed_response.json /tmp/generate_response.json /tmp/schedule_response.json /tmp/org_id.txt /tmp/final_schedule.json
    log_success "Cleanup completed"
}

# Main execution
main() {
    local year=${1:-2025}
    local month=${2:-1}
    
    echo "Testing schedule generation for $year-$month"
    echo ""
    
    check_server
    seed_database
    generate_schedule $year $month
    view_schedule $year $month
    validate_schedule
    analyze_patterns
    
    echo ""
    log_success "🎉 Testing pipeline completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Review the schedule in browser: $BASE_URL/api/test/schedule/$(cat /tmp/org_id.txt 2>/dev/null || echo '{orgId}')/$year/$month"
    echo "2. Run with different months: ./scripts/test-generation.sh 2025 2"
    echo "3. Check workload fairness and constraint satisfaction"
    
    cleanup
}

# Run main function with arguments
main "$@"
