package com.example.notes

import kotlinx.coroutines.delay
import kotlin.math.max

/**
 * A note with optional tags.
 *
 * @property title shown in lists
 */
data class Note(val id: Long, val title: String, val tags: List<String> = emptyList())

sealed interface Result<out T> {
    data class Ok<T>(val value: T) : Result<T>
    data object Missing : Result<Nothing>
}

enum class Priority(val weight: Int) { LOW(1), HIGH(10) }

typealias Notes = MutableMap<Long, Note>

class NoteRepository(private val notes: Notes = mutableMapOf()) {
    companion object {
        const val LIMIT = 100
        private val EMPTY_TITLE = Regex("^\\s*$")
    }

    var version: Int = 0
        private set

    suspend fun find(id: Long): Result<Note> {
        delay(10L)
        return notes[id]?.let { Result.Ok(it) } ?: Result.Missing
    }

    fun add(note: Note): Boolean = when {
        notes.size >= LIMIT -> false
        EMPTY_TITLE.matches(note.title) -> false
        else -> {
            notes[note.id] = note
            this.version += 1
            true
        }
    }

    fun titles(priority: Priority? = null): List<String> =
        notes.values
            .filter { it.tags.isNotEmpty() && priority != Priority.LOW }
            .sortedBy(Note::id)
            .map { note -> note.title.uppercase() }

    inline fun <reified T : Any> describe(value: T): String = when (value) {
        is Note -> "note ${value.id}"
        !is String -> "other ${T::class.simpleName}"
        else -> value
    }

    operator fun get(id: Long): Note? = notes[id]
}

fun Note.isTagged(tag: String) = tag in tags

@Suppress("MagicNumber")
fun main() {
    val repo = NoteRepository()
    var count = 0
    for (i in 1..3) count += i
    val hex = 0xFF and 0b1010
    val ratio = max(1.5, 2e3)
    val first = repo[1L]?.title ?: "none"
    val quote = 'q'
    try {
        check(count > 0) { "count must be positive" }
    } catch (e: IllegalStateException) {
        println(e.message)
    } finally {
        println("Added: ${repo.add(Note(1, "Hello", listOf("x")))} $first $hex $ratio $quote\t…")
    }
}
