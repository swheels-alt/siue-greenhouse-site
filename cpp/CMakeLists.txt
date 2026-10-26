# C++ server components (QA plan 3.1). Which server parts are C++ is set by ADR 0001 (D1).
cmake_minimum_required(VERSION 3.20)
project(greenhouse_cpp VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

option(GREENHOUSE_COVERAGE "Build with gcov flags so gcovr can report coverage (reported only, QA plan 7.3)" OFF)

add_library(greenhouse src/version.cpp src/conflict.cpp)
target_include_directories(greenhouse PUBLIC include)
target_compile_options(greenhouse PRIVATE -Wall -Wextra -Wpedantic -Werror)

if(GREENHOUSE_COVERAGE)
  target_compile_options(greenhouse PRIVATE --coverage -O0)
  target_link_options(greenhouse PUBLIC --coverage)
endif()

# GoogleTest, pinned to a release tag (bump through a reviewed PR)
include(FetchContent)
FetchContent_Declare(
  googletest
  GIT_REPOSITORY https://github.com/google/googletest.git
  GIT_TAG v1.17.0
  GIT_SHALLOW TRUE
)
set(INSTALL_GTEST OFF CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

enable_testing()
add_executable(greenhouse_tests tests/version_test.cpp tests/conflict_test.cpp)
target_link_libraries(greenhouse_tests PRIVATE greenhouse GTest::gtest_main)
include(GoogleTest)
gtest_discover_tests(greenhouse_tests)
