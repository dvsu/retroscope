// Flutter theme fixture: Dart 3.4 + Flutter 3.24


library theme_fixture;

import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math';
import 'dart:isolate';
import 'dart:typed_data';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart'; // Riverpod 2.5+

// ==================== NULL SAFETY & LATE ====================
late String lateVar; // Late initialization
late final String lateFinal; // Late final

String? nullableString;
String nonNullable = 'hello';

Never neverFunc() => throw Exception('Never returns');

// ==================== RECORDS & PATTERNS (2.17+/3.0+) ====================
(String name, int age) person = ('Alice', 30);

(int first, int rest...) numbers = (1, 2, 3, 4, 5);

void destructuring({(String name, int age) person}) {
  switch (person) {
    case (name: 'Alice', age: 30):
      print('Alice found');
    case (name: var n, age: >18):
      print('Adult: $n');
    case (String(), _):
    default:
      print('Other');
  }
}

void listPattern(List<int> list) {
  switch (list) {
    case [1, 2, 3]:
      print('Exact match');
    case [var first, ...?, var last]:
      print('First: $first, Last: $last');
    case <int>[]:
      print('Empty');
  }
}

// ==================== EXTENSION TYPES (3.0+) ====================
extension type SafeInt(int value) {
  bool get isPositive => value > 0;
  SafeInt operator +(SafeInt other) => SafeInt(value + other.value);
  bool operator ==(Object other) => other is SafeInt && value == other.value;
}

// ==================== ENUMS (enhanced 2.17+) ====================
enum Status {
  loading('⏳'),
  success('✅'),
  error('❌');

  const Status(this.icon);
  final String icon;

  bool get isFinal => this == success || this == error;

  Status next() => switch (this) {
    loading => success,
    success => error,
    error => loading,
  };
}

// ==================== GENERICS & TYPE ALIASES ====================
typedef IntList = List<int>;
typedef UserCallback = void Function(String name, int id);

T? firstOrNull<T>(Iterable<T> items, {bool Function(T)? predicate}) {
  for (final item in items) {
    if (predicate?.call(item) ?? true) {
      return item;
    }
  }
  return null;
}

// ==================== CLASSES & MIXINS (sealed/base/interface/final) ====================
sealed class Shape {
  double get area;
  void draw(Canvas canvas);
}

base class Rectangle extends Shape {
  final double width, height;

  Rectangle(this.width, this.height);

  @override
  double get area => width * height;

  @override
  void draw(Canvas canvas) {
    // Canvas drawing
  }
}

final class Circle extends Shape {
  final double radius;

  Circle(this.radius);

  @override
  double get area => pi * radius * radius;

  @override
  void draw(Canvas canvas) {}
}

interface class Drawable {
  void render();
}

// ==================== MIXINS ====================
mixin Logger<T extends Shape> {
  void log(String message) {
    debugPrint('[$runtimeType] $message');
  }

  void logArea(T shape) => log('Area: ${shape.area}');
}

mixin Draggable {
  Offset position = Offset.zero;
  void drag(Offset delta) => position += delta;
}

// ==================== EXTENSIONS ====================
extension ListExt<T> on List<T> {
  T? safeRemoveAt(int index) {
    if (index >= 0 && index < length) {
      return removeAt(index);
    }
    return null;
  }

  List<T> copyWithFilter(bool Function(T) test) =>
      where(test).toList();
}

extension StringExt on String {
  bool get isEmail => RegExp(r'^[^@]+@[^@]+\.[^@]+$').hasMatch(this);
}

// ==================== ASYNC/AWAIT & STREAMS ====================
Future<String> fetchUser(int id) async {
  await Future.delayed(Duration(milliseconds: 500));
  return 'User $id';
}

Stream<int> countStream(int max) async* {
  for (int i = 0; i < max; i++) {
    await Future.delayed(Duration(seconds: 1));
    yield i;
  }
}

Future<void> processStream() async {
  await for (final value in countStream(5)) {
    print('Received: $value');
  }
}

// ==================== ISOLATES ====================
@pragma('vm:entry-point')
void isolateEntry(SendPort sendPort) {
  final receivePort = ReceivePort();
  sendPort.send(receivePort.sendPort);

  receivePort.listen((message) {
    if (message == 'stop') {
      receivePort.close();
      Isolate.exit();
    } else {
      sendPort.send('Processed: $message');
    }
  });
}

// ==================== RECORDS & CONST CONSTRUCTORS ====================
const Point = (double x, double y);
const SizedBoxData = ({double width, double height, Color? color});

Widget sizedBox(SizedBoxData data) => SizedBox(
  width: data.width,
  height: data.height,
  backgroundColor: data.color,
);

// ==================== COLLECTION LITERALS & CONTROL FLOW ====================
final users = [
  User(name: 'Alice', age: 30),
  if (true) User(name: 'Bob', age: 25),
  for (var i = 0; i < 2; i++) User(name: 'Carol $i', age: 28),
  ...[User(name: 'Dave', age: 35)], // Spread
];

final filtered = users.where((u) => u.age > 25).toList();

// ==================== FLUTTER WIDGETS ====================
final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

class ThemeApp extends ConsumerStatefulWidget {
  const ThemeApp({super.key, required this.title});
  final String title;

  @override
  ConsumerState<ThemeApp> createState() => _ThemeAppState();
}

class _ThemeAppState extends ConsumerState<ThemeApp> {
  late SafeInt counter;
  late final ValueNotifier<bool> isDark;
  Status _status = Status.loading;

  @override
  void initState() {
    super.initState();
    counter = SafeInt(0);
    isDark = ValueNotifier(false);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      lateVar = 'Initialized';
      lateFinal = 'Finalized';
    });
  }

  @override
  void dispose() {
    isDark.dispose();
    super.dispose();
  }

  Future<void> _incrementAsync() async {
    setState(() => _status = Status.loading);
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      counter = counter + SafeInt(1);
      setState(() => _status = Status.success);
    } catch (e) {
      setState(() => _status = Status.error);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = ref.watch(themeProvider);

    return MaterialApp(
      navigatorKey: navigatorKey,
      title: widget.title,
      theme: theme,
      darkTheme: theme.dark(),
      themeMode: theme.brightness == Brightness.dark
          ? ThemeMode.dark
          : ThemeMode.light,

      home: Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
          actions: [
            ValueListenableBuilder<bool>(
              valueListenable: isDark,
              builder: (context, dark, _) => Switch(
                value: dark,
                onChanged: (value) {
                  ref.read(themeProvider.notifier).toggle();
                  isDark.value = value;
                },
              ),
            ),
          ],
        ),

        body: SingleChildScrollView(
          child: Column(
            children: [
              // Status chips
              Wrap(
                children: Status.values
                    .map((s) => ChoiceChip(
                      label: Text('${s.icon} ${s.name}'),
                      selected: _status == s,
                      onSelected: (_) => setState(() => _status = s),
                    ))
                    .toList(),
              ),

              // Counter
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      Text(
                        'Counter: ${counter.value}',
                        style: Theme.of(context).headlineMedium,
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          ElevatedButton(
                            onPressed: _incrementAsync,
                            child: const Text('Increment'),
                          ),
                          OutlinedButton(
                            onPressed: () => counter = SafeInt(max(0, counter.value - 1)),
                            child: const Text('Decrement'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // Records & patterns
              ListTile(
                title: const Text('Records'),
                subtitle: Text('(${person.$1}, ${person.$2})'),
                trailing: const Icon(Icons.arrow_forward_ios),
                onTap: () => _showDialog(Point(10, 20)),
              ),

              // Null safety demo
              ListTile(
                title: Text(nonNullable),
                subtitle: Text(nullableString ?? 'Null'),
                trailing: IconButton(
                  icon: const Icon(Icons.refresh),
                  onPressed: () {
                    lateVar = 'Updated';
                    setState(() => nullableString = 'New value');
                  },
                ),
              ),

              // FutureBuilder & StreamBuilder
              FutureBuilder<String>(
                future: fetchUser(1),
                builder: (context, snapshot) {
                  return switch (snapshot.connectionState) {
                    ConnectionState.done => Text(snapshot.data ?? 'No data'),
                    _ => const CircularProgressIndicator(),
                  };
                },
              ),

              StreamBuilder<int>(
                stream: countStream(10),
                builder: (context, snapshot) => snapshot.hasData
                    ? Text('Stream: ${snapshot.data}')
                    : const SizedBox(),
              ),
            ],
          ),
        ),

        floatingActionButton: FloatingActionButton(
          onPressed: () => _showBottomSheet(context),
          tooltip: 'Show sheet',
          child: const Icon(Icons.menu),
        ),

        drawer: const Drawer(
          child: ListView(
            children: [
              DrawerHeader(child: Text('Theme Fixture')),
              ListTile(title: Text('Home'), leading: Icon(Icons.home)),
              ListTile(title: Text('Settings'), leading: Icon(Icons.settings)),
            ],
          ),
        ),
      ),
    );
  }

  void _showDialog(Point point) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Record Dialog'),
        content: Text('Point: (${point.$1}, ${point.$2})'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _showBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            leading: const Icon(Icons.palette),
            title: const Text('Theme'),
            subtitle: Text(ref.read(themeProvider).brightness.name),
          ),
          ListTile(
            leading: const Icon(Icons.counter_1),
            title: Text('Counter: ${counter.value}'),
          ),
        ],
      ),
    );
  }
}

// ==================== RIVERPOD PROVIDERS ====================
final themeProvider = StateNotifierProvider<ThemeNotifier, ThemeState>((ref) {
  return ThemeNotifier();
});

class ThemeState {
  final Brightness brightness;
  const ThemeState({required this.brightness});

  ThemeData light() => ThemeData.light();
  ThemeData dark() => ThemeData.dark();
}

class ThemeNotifier extends StateNotifier<ThemeState> {
  ThemeNotifier() : super(const ThemeState(brightness: Brightness.light));

  void toggle() {
    state = ThemeState(
      brightness: state.brightness == Brightness.light
          ? Brightness.dark
          : Brightness.light,
    );
  }
}

class User {
  final String name;
  final int age;

  const User({required this.name, required this.age});
}

// ==================== MAIN ====================
void main() {
  lateVar = 'Main started';
  lateFinal = 'Version 1.0';

  runApp(
    ProviderScope(
      child: const ThemeApp(title: 'Dart/Flutter Theme Fixture'),
    ),
  );
}
