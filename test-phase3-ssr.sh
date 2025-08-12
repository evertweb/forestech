#!/bin/bash

# Test script for Phase 3 SSR implementation
# Tests vehicles and inventory SSR routes

echo "🧪 Testing Phase 3 SSR Implementation"
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL - adjust for environment
BASE_URL="https://forestechdecolombia.com.co"
if [ "$NODE_ENV" = "development" ]; then
  BASE_URL="http://localhost:5000"
fi

echo "📍 Testing against: $BASE_URL"
echo ""

# Function to test a route
test_route() {
  local route=$1
  local description=$2
  local expected_content=$3
  
  echo "🔍 Testing: $description"
  echo "   Route: $route"
  
  # Make request with timeout
  response=$(curl -s -w "HTTPSTATUS:%{http_code};TIME:%{time_total}" \
    -H "User-Agent: Phase3-SSR-Test/1.0" \
    -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
    --max-time 10 \
    "$BASE_URL$route" 2>/dev/null)
  
  if [ $? -ne 0 ]; then
    echo -e "   ${RED}❌ FAIL${NC} - Request failed or timed out"
    return 1
  fi
  
  # Extract HTTP status and time
  http_code=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
  time_total=$(echo "$response" | grep -o "TIME:[0-9.]*" | cut -d: -f2)
  body=$(echo "$response" | sed -E 's/HTTPSTATUS:[0-9]*;TIME:[0-9.]*$//')
  
  # Convert time to milliseconds
  time_ms=$(echo "$time_total * 1000" | bc)
  
  echo "   Status: $http_code | Time: ${time_ms}ms"
  
  # Check HTTP status
  if [ "$http_code" -ne 200 ]; then
    echo -e "   ${RED}❌ FAIL${NC} - HTTP $http_code"
    return 1
  fi
  
  # Check for SSR content
  if [[ "$body" == *"$expected_content"* ]]; then
    echo -e "   ${GREEN}✅ PASS${NC} - SSR content found"
    
    # Check if it's actually SSR (not CSR fallback)
    if [[ "$body" == *"x-fallback-csr"* ]]; then
      echo -e "   ${YELLOW}⚠️  WARN${NC} - CSR fallback detected"
      return 2
    fi
    
    # Performance check
    if (( $(echo "$time_ms < 1500" | bc -l) )); then
      echo -e "   ${GREEN}⚡ PERF${NC} - Good performance (${time_ms}ms)"
    else
      echo -e "   ${YELLOW}🐌 SLOW${NC} - Slow response (${time_ms}ms)"
    fi
    
    return 0
  else
    echo -e "   ${RED}❌ FAIL${NC} - Expected content not found"
    echo "   Looking for: '$expected_content'"
    return 1
  fi
}

# Test results counters
total_tests=0
passed_tests=0
failed_tests=0
warning_tests=0

# Test function wrapper
run_test() {
  total_tests=$((total_tests + 1))
  test_route "$@"
  result=$?
  
  case $result in
    0) passed_tests=$((passed_tests + 1)) ;;
    1) failed_tests=$((failed_tests + 1)) ;;
    2) warning_tests=$((warning_tests + 1)) ;;
  esac
  
  echo ""
}

echo "🚀 Starting Phase 3 SSR Tests"
echo ""

# Test 1: Vehicles SSR
run_test "/combustibles/vehiculos" \
  "Vehicles SSR Page" \
  "Vehículos - Forestech"

# Test 2: Inventory SSR  
run_test "/combustibles/inventario" \
  "Inventory SSR Page" \
  "Inventario - Forestech"

# Test 3: Dashboard SSR (Phase 1 - should still work)
run_test "/combustibles/dashboard" \
  "Dashboard SSR Page" \
  "Dashboard - Forestech"

# Test 4: Movements SSR (Phase 2 - should still work)
run_test "/combustibles/movimientos" \
  "Movements SSR Page" \
  "Movimientos de Combustible"

# Test 5: Landing page (baseline)
run_test "/combustibles/" \
  "Landing Page SSR" \
  "Sistema de Combustibles"

# Test 6: SSR Health Check
run_test "/combustibles/ssr-health" \
  "SSR Health Check" \
  "SSR Health Check"

echo "📊 Test Summary"
echo "================"
echo -e "Total Tests: $total_tests"
echo -e "${GREEN}Passed: $passed_tests${NC}"
echo -e "${YELLOW}Warnings: $warning_tests${NC}"
echo -e "${RED}Failed: $failed_tests${NC}"
echo ""

# Overall result
if [ $failed_tests -eq 0 ]; then
  if [ $warning_tests -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo "Phase 3 SSR implementation is working correctly."
  else
    echo -e "${YELLOW}⚠️  TESTS PASSED WITH WARNINGS${NC}"
    echo "Some routes may be falling back to CSR."
  fi
  exit 0
else
  echo -e "${RED}❌ SOME TESTS FAILED${NC}"
  echo "Phase 3 SSR implementation needs attention."
  exit 1
fi