#include "greenhouse/version.hpp"

#include <gtest/gtest.h>

TEST(VersionTest, MatchesProjectVersion) { EXPECT_EQ(greenhouse::Version(), "0.1.0"); }

TEST(VersionTest, IsNotEmpty) { EXPECT_FALSE(greenhouse::Version().empty()); }
