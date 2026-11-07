package com.example.notes

import kotlinx.coroutines.delay

/** A note with optional tags. */
data class Note(val id: Long, val title: String, val tags: List<String> = emptyList())

sealed interface Result<out T> {
    data class Ok<T>(val value: T) : Result<T>
    data object Missing : Result<Nothing>
}

class NoteRepository(private val notes: MutableMap<Long, Note> = mutableMapOf()) {
    companion object { const val LIMIT = 100 }

    suspend fun find(id: Long): Result<Note> {
        delay(10L)
        return notes[id]?.let { Result.Ok(it) } ?: Result.Missing
    }

    fun add(note: Note): Boolean = when {
        notes.size >= LIMIT -> false
        else -> { notes[note.id] = note; true }
    }
}

fun main() {
    val repo = NoteRepository()
    println("Added: ${repo.add(Note(1, "Hello", listOf("x")))} ${null ?: 0.5f}")
}
