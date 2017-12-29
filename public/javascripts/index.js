$( function() {
    var availableTags = [
      "Computer Systems: A Programmer's Perspective",
      "Structure and Interpretation of Computer Programs",
      "Advanced Programming in the UNIX Environment",
      "Effective C++: 55 Specific Ways to Improve Your Programs and Designs",
      "Concrete Mathematics",
      "Introduction to Algorithms",
      "Unix Network Programming",
      "The C Programming Language",
      "Head First Design Patterns",
      "Programming Collective Intelligence",
      "Design Patterns: Elements of Reusable Object-Oriented Software",
      "Code Complete",
      "C++ Primer, 4th Edition",
      "The Art of Unix Programming",
      "Agile Software Development: Principles, Patterns, and Practices",
      "Thinking in Java",
      "Effective Java Second Edition",
      "Expert C Programming:Deep C Secrets",
      "Code: The Hidden Language of Computer Hardware and Software",
      "The Practice of Programming"
    ];
    $( "#book" ).autocomplete({
      source: availableTags
    });
  });