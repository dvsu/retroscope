//! A tiny tokenizer.
use std::collections::HashMap;
use std::fmt;

#[derive(Debug, Clone, PartialEq)]
pub enum Token<'a> {
    Word(&'a str),
    Number(f64),
    Symbol(char),
}

pub struct Lexer<'a> {
    input: &'a str,
    counts: HashMap<String, usize>,
}

impl<'a> Lexer<'a> {
    pub fn new(input: &'a str) -> Self {
        Self { input, counts: HashMap::new() }
    }

    pub fn tokens(&mut self) -> Vec<Token<'a>> {
        let mut out = Vec::with_capacity(16);
        for part in self.input.split_whitespace() {
            *self.counts.entry(part.to_owned()).or_insert(0) += 1;
            match part.parse::<f64>() {
                Ok(n) => out.push(Token::Number(n)),
                Err(_) if part.len() == 1 => out.push(Token::Symbol(part.chars().next().unwrap())),
                Err(_) => out.push(Token::Word(part)),
            }
        }
        out
    }
}

impl fmt::Display for Token<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}
