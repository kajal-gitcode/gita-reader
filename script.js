document.addEventListener('DOMContentLoaded', () => {
    fetch('chapters') // Fetch the JSON data from verse.json
        .then(response => response.json())
        .then(data => {
            const chapterLinksDiv = document.getElementById('chapter-links');
            const chapterDisplayDiv = document.getElementById('chapter-display');
            // Group verses by chapter
            const chapters = {};
            data.forEach(verse => {
                const chapterId = verse.chapter_id;
                if (!chapters[chapterId]) {
                    chapters[chapterId] = {
                        title: `Chapter ${verse.chapter_number}`, // Assuming chapter_number is consistent for a chapter_id
                        verses: []
                    };
                }
                chapters[chapterId].verses.push(verse);
            });

            // Create chapter links
            for (const chapterId in chapters) {
                const chapter = chapters[chapterId];
                const link = document.createElement('a');
                link.href = `#chapter-${chapterId}`;
                link.textContent = chapter.title;
                link.addEventListener('click', (e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    displayChapter(chapter.verses, chapterDisplayDiv);
                });
                chapterLinksDiv.appendChild(link);
            }
        })
        .catch(error => console.error('Error fetching or parsing JSON:', error));
}); 

function transliterateWordMeanings(inputText) {
    if (!inputText) return "";

    const entries = inputText.split(";").map(e => e.trim()).filter(e => e);

    const result = entries.map(pair => {
        if (!pair.includes("—")) return "";

        const [roman, meaning] = pair.split("—").map(s => s.trim());
        const devnagari = Sanscript.t(roman, "iast", "devanagari");

        return `${roman} — ${devnagari} — ${meaning}`;
    });

    return result.join("; ");
}


function displayChapter(verses, container) {
    container.innerHTML = ''; // Clear previous content

    // Sort verses by verse_order or verse_number if needed
    verses.sort((a, b) => a.verse_order - b.verse_order);

    verses.forEach((verse) => {
        const verseDiv = document.createElement('div');
        verseDiv.classList.add('verse');

        const verseTitle = document.createElement('div');
        verseTitle.classList.add('verse-title');
        verseTitle.textContent = `Verse ${verse.verse_number}`; // Display verse title
        verseDiv.appendChild(verseTitle);

        const originalText  = document.createElement('p');
        originalText.innerHTML= verse.text.replace(/\n/g,'<br>');
        verseDiv.appendChild(originalText);
        
        const wordMeanings = document.createElement('p');
        const transliterated = transliterateWordMeanings(verse.word_meanings);
        wordMeanings.innerHTML = `<span style="font-weight: bold; color: black;">Word Meanings:</span> ${transliterated}`;
        verseDiv.appendChild(wordMeanings);
    container.appendChild(verseDiv);
});
}