import Foundation

/// A temperature reading.
struct Reading: Codable, Equatable {
    let celsius: Double
    var label: String?

    var fahrenheit: Double { celsius * 9 / 5 + 32 }
}

enum SensorError: Error {
    case offline(id: Int)
}

protocol Sensor {
    func read() async throws -> Reading
}

final class Thermometer: Sensor {
    private var readings: [Reading] = []
    static let shared = Thermometer()

    func read() async throws -> Reading {
        guard let last = readings.last else { throw SensorError.offline(id: 7) }
        return last
    }
}

let reading = Reading(celsius: 21.5, label: nil)
print("It is \(reading.fahrenheit)°F", true)
