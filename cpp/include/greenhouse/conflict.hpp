#ifndef GREENHOUSE_CONFLICT_HPP_
#define GREENHOUSE_CONFLICT_HPP_

// Reservation availability and conflict check (ADR 0001, proposed): the one job C++ does.
// Pure logic: no database, no network, no clock. The Python reservations module passes in the
// requested time and the approved reservations for the same space, and gets an answer back.

#include <cstddef>
#include <cstdint>
#include <vector>

namespace greenhouse {

/// A half-open time range [start, end), in minutes since the Unix epoch (UTC). A reservation
/// that ends at 10:00 and one that starts at 10:00 do not overlap.
struct TimeRange {
  std::int64_t start = 0;
  std::int64_t end = 0;
};

/// Two ranges are equal when they start and end at the same minutes.
[[nodiscard]] constexpr bool operator==(const TimeRange& first, const TimeRange& second) noexcept {
  return first.start == second.start && first.end == second.end;
}

/// Whether a requested range can be approved.
enum class Availability {
  kAvailable,     ///< Overlaps no approved reservation.
  kConflict,      ///< Overlaps at least one approved reservation.
  kInvalidRange,  ///< Ends at or before it starts, so it cannot be checked.
};

/// The answer to one availability check.
struct ConflictResult {
  Availability availability = Availability::kInvalidRange;
  /// Indexes into the approved list of every reservation the request overlaps, in list order.
  std::vector<std::size_t> conflicts;
};

/// True when the range ends after it starts.
[[nodiscard]] bool IsValid(const TimeRange& range) noexcept;

/// True when two valid ranges share at least one minute.
[[nodiscard]] bool Overlaps(const TimeRange& first, const TimeRange& second) noexcept;

/// Checks a requested range against the approved reservations for the same space. Invalid
/// approved ranges are ignored, so one bad record cannot block every request.
[[nodiscard]] ConflictResult CheckRequest(const TimeRange& requested,
                                          const std::vector<TimeRange>& approved);

/// Lists the free gaps inside a window (for example, one day's opening hours), earliest first.
/// Approved reservations may be in any order, may overlap each other and may extend past the
/// window. Returns nothing for an invalid window.
[[nodiscard]] std::vector<TimeRange> OpenSlots(const TimeRange& window,
                                               std::vector<TimeRange> approved);

}  // namespace greenhouse

#endif  // GREENHOUSE_CONFLICT_HPP_
