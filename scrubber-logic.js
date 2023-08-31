let parsedData; // Global variable to store parsed data

        function handleFile() {
            const fileInput = document.getElementById('csvFile');
            const file = fileInput.files[0];

            if (!file) {
                alert("Please select a file to upload.");
                return;
            }

            Papa.parse(file, {
                complete: function(results) {
                    parsedData = results.data;
                    displayColumnTitles();
                }
            });
        }

        function displayColumnTitles() {
            const startColumnDropdown = document.getElementById('startColumn');
            const endColumnDropdown = document.getElementById('endColumn');
            const startColumnDropdownZigzag = document.getElementById('startColumnZigzag');
            const endColumnDropdownZigzag = document.getElementById('endColumnZigzag');

            // Clear existing options
            while (startColumnDropdown.firstChild) {
                startColumnDropdown.removeChild(startColumnDropdown.firstChild);
            }
            while (startColumnDropdownZigzag.firstChild) {
                startColumnDropdownZigzag.removeChild(startColumnDropdownZigzag.firstChild);
            }
            while (endColumnDropdown.firstChild) {
                endColumnDropdown.removeChild(endColumnDropdown.firstChild); 
            }
            while (endColumnDropdownZigzag.firstChild) {
                endColumnDropdownZigzag.removeChild(endColumnDropdownZigzag.firstChild);
            }


            // Add each column title as an option in the dropdown
            const headerRow = parsedData[0];
            for (let i = 0; i < headerRow.length; i++) {
                const option1 = document.createElement('option');
                option1.text = headerRow[i];
                option1.value = i;
                startColumnDropdown.appendChild(option1);

                const option2 = document.createElement('option');
                option2.text = headerRow[i];
                option2.value = i;
                endColumnDropdown.appendChild(option2);

                const option3 = document.createElement('option');
                option3.text = headerRow[i];
                option3.value = i;
                startColumnDropdownZigzag.appendChild(option3);

                const option4 = document.createElement('option');
                option4.text = headerRow[i];
                option4.value = i;
                endColumnDropdownZigzag.appendChild(option4);
            }
        }

        function checkMatchingConsecutiveValues() {
            const startColumnIndex = parseInt(document.getElementById('startColumn').value, 10);
            const endColumnIndex = parseInt(document.getElementById('endColumn').value, 10);
            const consecutiveValues = parseInt(document.getElementById('range').value, 10);

            if (isNaN(startColumnIndex) || isNaN(endColumnIndex) || isNaN(consecutiveValues) || startColumnIndex < 0 || endColumnIndex >= parsedData[0].length || startColumnIndex > endColumnIndex || consecutiveValues < 1) {
                alert("Please select valid columns and enter a valid number of consecutive values.");
                return;
            }

            let matchingRows = [];

            // Loop through rows and check if the specified range of columns have at least x consecutive matching values
            for (let i = 1; i < parsedData.length; i++) {
                let consecutiveCount = 1;
                for (let j = startColumnIndex; j < endColumnIndex; j++) {
                    if (parsedData[i][j] !== parsedData[i][j + 1]) {
                        consecutiveCount = 1;
                    } else {
                        consecutiveCount++;
                        if (consecutiveCount >= consecutiveValues) {
                            // Create a new array containing selected columns' values and the rest of the row values
                            const selectedColumnsRow = parsedData[i].slice(startColumnIndex, endColumnIndex + 1);
                            const restOfTheRow = parsedData[i].slice(0, startColumnIndex).concat(parsedData[i].slice(endColumnIndex + 1));
                            matchingRows.push(selectedColumnsRow.concat(restOfTheRow));
                            break;
                        }
                    }
                }
            }

            let tableHTML = '<table>';
            tableHTML += '<tr>';

            // Display the selected columns' headers at the beginning of the table
            for (let i = startColumnIndex; i <= endColumnIndex; i++) {
                tableHTML += '<th class="selected-column">' + parsedData[0][i] + '</th>';
            }

            // Display the rest of the headers
            for (let i = 0; i < parsedData[0].length; i++) {
                if (i < startColumnIndex || i > endColumnIndex) {
                    tableHTML += '<th>' + parsedData[0][i] + '</th>';
                }
            }

            tableHTML += '</tr>';

            // Display the rows with matching consecutive values in the specified range of columns
            for (let i = 0; i < matchingRows.length; i++) {
                tableHTML += '<tr>';
                for (let j = 0; j < matchingRows[i].length; j++) {
                    if (j >= 0 && j <= endColumnIndex-startColumnIndex) {
                        tableHTML += '<td class="selected-column">' + matchingRows[i][j] + '</td>';
                    } else {
                        tableHTML += '<td>' + matchingRows[i][j] + '</td>';
                    }
                }
                tableHTML += '</tr>';
            }
            tableHTML += '</table>';

            const csvDataDiv = document.getElementById('csvData');
            csvDataDiv.innerHTML = tableHTML;
        }

        function checkZigzaggingValues() {
            const zigzagStartIndex = parseInt(document.getElementById('startColumnZigzag').value, 10);
            const zigzagEndIndex = parseInt(document.getElementById('endColumnZigzag').value, 10);
            const zigzagRange = parseInt(document.getElementById('rangeZigzag').value, 10);

            if (isNaN(zigzagStartIndex) || isNaN(zigzagEndIndex) || isNaN(zigzagRange) || zigzagStartIndex < 0 || zigzagEndIndex >= parsedData[0].length || zigzagStartIndex > zigzagEndIndex || zigzagRange < 1) {
                alert("Please enter valid values.");
                return;
            }

            let matchingRows = [];

            // Loop through rows and check for zigzagging values in the specified range
            for (let i = 1; i < parsedData.length; i++) {
                let zigzaggingCount = 1;
                for (let j = zigzagStartIndex; j < zigzagEndIndex; j++) {

                    const currentValue = parseInt(parsedData[i][j], 10);
                    const previousValue = parseInt(parsedData[i][j - 1], 10);

                    if (Math.abs(currentValue - previousValue) !== 1) {
                        zigzaggingCount = 1;
                    } else {
                        zigzaggingCount++
                        if (zigzaggingCount >= zigzagRange) {
                            const selectedColumnsRow = parsedData[i].slice(zigzagStartIndex, zigzagEndIndex + 1);
                            const restOfTheRow = parsedData[i].slice(0, zigzagStartIndex).concat(parsedData[i].slice(zigzagEndIndex + 1));
                            matchingRows.push(selectedColumnsRow.concat(restOfTheRow));
                            break;
                        }
                    }
                }
            }

            let tableHTML = '<table>';
            tableHTML += '<tr>';

            // Display the selected columns' headers at the beginning of the table
            for (let i = zigzagStartIndex; i <= zigzagEndIndex; i++) {
                tableHTML += '<th class="selected-column">' + parsedData[0][i] + '</th>';
            }

            // Display the rest of the headers
            for (let i = 0; i < parsedData[0].length; i++) {
                if (i < zigzagStartIndex || i > zigzagEndIndex) {
                    tableHTML += '<th>' + parsedData[0][i] + '</th>';
                }
            }

            tableHTML += '</tr>';

            // Display the rows with matching zigzagging values in the specified range of columns
            for (let i = 0; i < matchingRows.length; i++) {
                tableHTML += '<tr>';
                for (let j = 0; j < matchingRows[i].length; j++) {
                    if (j >= 0 && j <= zigzagEndIndex - zigzagStartIndex) {
                        tableHTML += '<td class="selected-column">' + matchingRows[i][j] + '</td>';
                    } else {
                        tableHTML += '<td>' + matchingRows[i][j] + '</td>';
                    }
                }
                tableHTML += '</tr>';
            }
            tableHTML += '</table>';

            const csvDataDiv = document.getElementById('csvData');
            csvDataDiv.innerHTML = tableHTML;
        }

