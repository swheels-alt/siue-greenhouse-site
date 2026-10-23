#ifndef GREENHOUSE_VERSION_HPP_
#define GREENHOUSE_VERSION_HPP_

#include <string_view>

namespace greenhouse {

/// Returns the version of the C++ server components, reported by /health and in logs.
[[nodiscard]] std::string_view Version() noexcept;

}  // namespace greenhouse

#endif  // GREENHOUSE_VERSION_HPP_
