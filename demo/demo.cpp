#include <iostream>
#include <string>
#include <vector>

namespace geo {

constexpr double kPi = 3.14159;

template <typename T>
class Shape {
 public:
  explicit Shape(std::string name) : name_(std::move(name)) {}
  virtual ~Shape() = default;
  virtual T area() const = 0;
  const std::string& name() const noexcept { return name_; }

 private:
  std::string name_;
};

class Circle final : public Shape<double> {
 public:
  explicit Circle(double r) : Shape("circle"), r_(r) {}
  double area() const override { return kPi * r_ * r_; }

 private:
  double r_;
};

}  // namespace geo

int main() {
  std::vector<geo::Circle> shapes{geo::Circle(1.5), geo::Circle(2)};
  for (const auto& s : shapes) {
    std::cout << s.name() << ": " << s.area() << '\n';
  }
  return shapes.empty() ? 1 : 0;
}
