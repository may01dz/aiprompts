function openTab(tabName) {
    const tabs = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = 'none';
    }
    document.getElementById(tabName).style.display = 'block';
}

function activateGenerateButton(type) {
    const start = document.getElementById(`start${type}`).value;
    const end = document.getElementById(`end${type}`).value;
    const generateButton = document.getElementById(`generateButton${type}`);

    if (start !== '' && end !== '') {
        generateButton.disabled = false;
    } else {
        generateButton.disabled = true;
    }
}

function createParagraph(start, end) {
    const words = [];
    for (let i = start; i <= end; i++) {
        words.push(`"paper-${i}.pdf"`);
    }
    return words.join(', ');
}

function createReferenceList(start, end) {
    const references = [];
    for (let i = start; i <= end; i++) {
        references.push(`Paper ${i}: [Insert the complete reference details here]`);
    }
    return references;
}

function toggleResultsInput(type) {
    const directInput = document.getElementById('resultsDirectInput');
    const fileInput = document.getElementById('resultsFileInput');
    const directCheckbox = document.getElementById('resultsDirectCheckbox');
    const fileCheckbox = document.getElementById('resultsFileCheckbox');

    if (type === 'direct') {
        directInput.style.display = 'block';
        fileInput.style.display = 'none';
        fileCheckbox.checked = false; 
        fileCheckbox.disabled = true; 
    } else if (type === 'file') {
        directInput.style.display = 'none';
        fileInput.style.display = 'block';
        directCheckbox.checked = false; 
        directCheckbox.disabled = true; 
    }
}

function generatePrompt(type) {
    const start = parseInt(document.getElementById(`start${type}`).value);
    const end = parseInt(document.getElementById(`end${type}`).value);

    if (isNaN(start) || isNaN(end) || start > end) {
        alert('Please enter valid start and end values.');
        return;
    }

    const paperNames = createParagraph(start, end);
    const references = createReferenceList(start, end);

    let prompt = '';

    if (type === 'Direct') {
        const results = document.getElementById('resultsDirect').value.trim();

        prompt = `
[prompt]
Discussing Results with Papers-${start} to Paper-${end}
I want to discuss the results I obtained, specifically regarding the following points, in light of the findings from other researchers as recorded in their scientific papers. The key results from my study are:

${results}

Please analyze and discuss these results, using the findings and data presented in the scientific papers named ${paperNames} to support your discussion. 

Ensure that the discussion is consistent with the style used in the "Discussion" sections of scientific medical journals, adhering to the applicable principles and rules of the field.

Important: Do not search the internet for additional sources. Only analyze and reference the provided papers. Include in-text citations in the format [Paper X, paragraph X] and a reference list entry for each of these papers in the discussion as shown below.

References:
${references.join('\n')}
`;
    } else if (type === 'File') {
        const resultsFile = document.getElementById('resultsFile').value.trim();

        prompt = `
[prompt]
Discussing Results with Papers-${start} to Paper-${end}
I want to discuss the results I obtained, specifically regarding the following points, in light of the findings from other researchers as recorded in their scientific papers. The results that we want to discuss are saved in the attached file ${resultsFile}.

Please analyze and discuss these results, using the findings and data presented in the scientific papers named ${paperNames} to support your discussion. 

Ensure that the discussion is consistent with the style used in the "Discussion" sections of scientific medical journals, adhering to the applicable principles and rules of the field.

Important: Do not search the internet for additional sources. Only analyze and reference the provided papers. Include in-text citations in the format [Paper X, paragraph X] and a reference list entry for each of these papers in the discussion as shown below.

References:
${references.join('\n')}
`;
    } else if (type === 'Combining') {
        let results = '';
        const directCheckbox = document.getElementById('resultsDirectCheckbox');
        const fileCheckbox = document.getElementById('resultsFileCheckbox');

        if (directCheckbox.checked) {
            results = document.getElementById('resultsCombining').value.trim();
        } else if (fileCheckbox.checked) {
            results = document.getElementById('resultsFileCombining').value.trim();
        }

        prompt = `
[prompt]
Combining Discussion Versions from All Sets of Papers
I want to combine all versions of the discussion of results into one comprehensive version that brings together all the information, ideas, and data derived from the scientific papers provided. ${directCheckbox.checked ? 'The key results from my study are:' : `The results that we want to discuss are saved in the attached file ${results}`};

${directCheckbox.checked ? results : ''}

Ensure that the discussion is consistent with the style used in the "Discussion" sections of scientific medical journals, adhering to the applicable principles and rules of the field.

Instructions:

Combine Discussions: Merge the discussions from each version (based on different sets of papers) into one comprehensive discussion.
Use Provided Papers Only: Analyze and reference only the provided papers in each set:

${references.join('\n')}

Use the findings and data presented in the provided papers from each set to support the discussion. Ensure that the discussion adheres to the principles and rules of scientific medical journals.
`;
    }

    document.getElementById(`generatedPrompt${type}`).innerText = prompt;

    const copyButton = document.getElementById(`copyButton${type}`);
    copyButton.disabled = false;
}

function resetForm(type) {
    document.getElementById(`promptForm${type}`).reset();
    document.getElementById(`generatedPrompt${type}`).innerText = '';

    const directInput = document.getElementById('resultsDirectInput');
    const fileInput = document.getElementById('resultsFileInput');

    directInput.style.display = 'none';
    fileInput.style.display = 'none';

    const generateButton = document.getElementById(`generateButton${type}`);
    generateButton.disabled = true;
    const copyButton = document.getElementById(`copyButton${type}`);
    copyButton.disabled = true;

    // Enable checkboxes when resetting the form
    const directCheckbox = document.getElementById('resultsDirectCheckbox');
    const fileCheckbox = document.getElementById('resultsFileCheckbox');

    directCheckbox.disabled = false;
    fileCheckbox.disabled = false;
}

function copyPrompt(type) {
    const promptText = document.getElementById(`generatedPrompt${type}`).innerText;
    navigator.clipboard.writeText(promptText).then(() => {
        alert('Prompt copied to clipboard!');
    }, (err) => {
        alert('Failed to copy prompt: ', err);
    });
}