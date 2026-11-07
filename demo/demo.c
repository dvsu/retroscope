#include <stdio.h>
#include <stdlib.h>

#define BUFFER_SIZE 256

typedef struct {
    char *name;
    int age;
} Person;

static int compare(const void *a, const void *b) {
    const Person *pa = a, *pb = b;
    return pa->age - pb->age;
}

int main(int argc, char **argv) {
    Person people[] = {{"Ada", 36}, {"Linus", 21}};
    size_t n = sizeof people / sizeof people[0];
    qsort(people, n, sizeof(Person), compare);
    for (size_t i = 0; i < n; i++) {
        printf("%s is %d\n", people[i].name, people[i].age);
    }
    return argc > 1 ? EXIT_FAILURE : EXIT_SUCCESS;
}
