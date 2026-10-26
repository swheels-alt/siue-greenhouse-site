#include "greenhouse/conflict.hpp"

#include <gtest/gtest.h>

#include <cstddef>
#include <cstdint>
#include <vector>

namespace greenhouse {
namespace {

// Times in minutes after an arbitrary midnight; only differences matter to the check.
constexpr std::int64_t At(std::int64_t hours, std::int64_t minutes = 0) {
  return (hours * 60) + minutes;
}

// One approved booking, 10:00 to 12:00.
const std::vector<TimeRange> kMorning = {{At(10), At(12)}};

TEST(IsValidTest, NeedsEndAfterStart) {
  EXPECT_TRUE(IsValid({At(9), At(10)}));
  EXPECT_FALSE(IsValid({At(10), At(10)}));
  EXPECT_FALSE(IsValid({At(11), At(10)}));
}

TEST(CheckRequestTest, FreeWhenNothingIsApproved) {
  const ConflictResult result = CheckRequest({At(9), At(10)}, {});
  EXPECT_EQ(result.availability, Availability::kAvailable);
  EXPECT_TRUE(result.conflicts.empty());
}

TEST(CheckRequestTest, BackToBackBookingsDoNotConflict) {
  EXPECT_EQ(CheckRequest({At(8), At(10)}, kMorning).availability, Availability::kAvailable);
  EXPECT_EQ(CheckRequest({At(12), At(14)}, kMorning).availability, Availability::kAvailable);
}

TEST(CheckRequestTest, OneMinuteOfOverlapIsAConflict) {
  EXPECT_EQ(CheckRequest({At(8), At(10, 1)}, kMorning).availability, Availability::kConflict);
  EXPECT_EQ(CheckRequest({At(11, 59), At(13)}, kMorning).availability, Availability::kConflict);
}

TEST(CheckRequestTest, RequestInsideOrAroundABookingConflicts) {
  EXPECT_EQ(CheckRequest({At(10, 30), At(11)}, kMorning).availability, Availability::kConflict);
  EXPECT_EQ(CheckRequest({At(9), At(13)}, kMorning).availability, Availability::kConflict);
  EXPECT_EQ(CheckRequest({At(10), At(12)}, kMorning).availability, Availability::kConflict);
}

TEST(CheckRequestTest, ListsEveryConflictInListOrder) {
  const std::vector<TimeRange> approved = {{At(13), At(14)}, {At(8), At(9)}, {At(10), At(11)}};
  const ConflictResult result = CheckRequest({At(8, 30), At(13, 30)}, approved);
  EXPECT_EQ(result.availability, Availability::kConflict);
  EXPECT_EQ(result.conflicts, (std::vector<std::size_t>{0, 1, 2}));
}

TEST(CheckRequestTest, RejectsARequestThatEndsBeforeItStarts) {
  const ConflictResult result = CheckRequest({At(12), At(10)}, kMorning);
  EXPECT_EQ(result.availability, Availability::kInvalidRange);
  EXPECT_TRUE(result.conflicts.empty());
}

TEST(CheckRequestTest, RejectsAZeroLengthRequest) {
  EXPECT_EQ(CheckRequest({At(11), At(11)}, kMorning).availability, Availability::kInvalidRange);
}

TEST(CheckRequestTest, IgnoresAnInvalidApprovedRecord) {
  const std::vector<TimeRange> approved = {{At(14), At(9)}};
  EXPECT_EQ(CheckRequest({At(10), At(11)}, approved).availability, Availability::kAvailable);
}

TEST(CheckRequestTest, IgnoresAZeroLengthApprovedRecord) {
  const std::vector<TimeRange> approved = {{At(10, 30), At(10, 30)}};
  EXPECT_EQ(CheckRequest({At(10), At(11)}, approved).availability, Availability::kAvailable);
}

TEST(OpenSlotsTest, WholeWindowIsFreeWithNoBookings) {
  EXPECT_EQ(OpenSlots({At(8), At(17)}, {}), (std::vector<TimeRange>{{At(8), At(17)}}));
}

TEST(OpenSlotsTest, GapsAroundUnsortedOverlappingBookings) {
  const std::vector<TimeRange> approved = {{At(13), At(15)}, {At(9), At(10)}, {At(9, 30), At(11)}};
  EXPECT_EQ(OpenSlots({At(8), At(17)}, approved),
            (std::vector<TimeRange>{{At(8), At(9)}, {At(11), At(13)}, {At(15), At(17)}}));
}

TEST(OpenSlotsTest, BookingsPastTheWindowEdgesAreClipped) {
  const std::vector<TimeRange> approved = {{At(6), At(9)}, {At(16), At(20)}, {At(18), At(19)}};
  EXPECT_EQ(OpenSlots({At(8), At(17)}, approved), (std::vector<TimeRange>{{At(9), At(16)}}));
}

TEST(OpenSlotsTest, ABookingNestedInsideAnotherDoesNotReopenTime) {
  const std::vector<TimeRange> approved = {{At(9), At(13)}, {At(10), At(11)}};
  EXPECT_EQ(OpenSlots({At(8), At(17)}, approved),
            (std::vector<TimeRange>{{At(8), At(9)}, {At(13), At(17)}}));
}

TEST(OpenSlotsTest, BackToBackBookingsLeaveNoEmptySlots) {
  const std::vector<TimeRange> approved = {{At(8), At(10)}, {At(10), At(12)}};
  EXPECT_EQ(OpenSlots({At(8), At(17)}, approved), (std::vector<TimeRange>{{At(12), At(17)}}));
}

TEST(OpenSlotsTest, BookedExactlyToClosingTimeHasNoSlots) {
  EXPECT_TRUE(OpenSlots({At(8), At(17)}, {{At(8), At(17)}}).empty());
}

TEST(OpenSlotsTest, FullyBookedWindowHasNoSlots) {
  EXPECT_TRUE(OpenSlots({At(8), At(17)}, {{At(7), At(18)}}).empty());
}

TEST(OpenSlotsTest, InvalidWindowOrBookingsAreIgnored) {
  EXPECT_TRUE(OpenSlots({At(17), At(8)}, {}).empty());
  EXPECT_EQ(OpenSlots({At(8), At(17)}, {{At(12), At(10)}}),
            (std::vector<TimeRange>{{At(8), At(17)}}));
}

TEST(OpenSlotsTest, AgreesWithCheckRequest) {
  const std::vector<TimeRange> approved = {{At(9), At(10)}, {At(12), At(14)}};
  for (const TimeRange& slot : OpenSlots({At(8), At(17)}, approved)) {
    EXPECT_EQ(CheckRequest(slot, approved).availability, Availability::kAvailable);
  }
}

}  // namespace
}  // namespace greenhouse
