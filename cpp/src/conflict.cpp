#include "greenhouse/conflict.hpp"

#include <algorithm>
#include <cstddef>
#include <vector>

namespace greenhouse {

bool IsValid(const TimeRange& range) noexcept { return range.end > range.start; }

bool Overlaps(const TimeRange& first, const TimeRange& second) noexcept {
  return first.start < second.end && second.start < first.end;
}

ConflictResult CheckRequest(const TimeRange& requested, const std::vector<TimeRange>& approved) {
  ConflictResult result;
  if (!IsValid(requested)) {
    return result;  // availability defaults to kInvalidRange
  }
  for (std::size_t index = 0; index < approved.size(); ++index) {
    if (IsValid(approved[index]) && Overlaps(requested, approved[index])) {
      result.conflicts.push_back(index);
    }
  }
  result.availability =
      result.conflicts.empty() ? Availability::kAvailable : Availability::kConflict;
  return result;
}

std::vector<TimeRange> OpenSlots(const TimeRange& window, std::vector<TimeRange> approved) {
  std::vector<TimeRange> slots;
  if (!IsValid(window)) {
    return slots;
  }
  std::sort(approved.begin(), approved.end(), [](const TimeRange& first, const TimeRange& second) {
    return first.start < second.start;
  });
  std::int64_t free_from = window.start;
  for (const TimeRange& booked : approved) {
    if (!IsValid(booked) || !Overlaps(booked, window)) {
      continue;
    }
    if (booked.start > free_from) {
      slots.push_back({free_from, booked.start});
    }
    free_from = std::max(free_from, booked.end);
  }
  if (free_from < window.end) {
    slots.push_back({free_from, window.end});
  }
  return slots;
}

}  // namespace greenhouse
