function findPattern(board, intendedPattern) {
	let count = 0;
	patternLength = 5;
	for (let row = 0; row < 10; row++) {
		for (let col = 0; col < 10; col++) {
			const patterns = [
				board[row].slice(col, col + patternLength).join(''), // Horizontal
				board.map(row => row[col]).slice(row, row + patternLength).join(''), // Vertical
				board.slice(row, row + patternLength).map((row, i) => row[col + i]).join(''), // Diagonal (top-left to bottom-right)
				board.slice(row, row + patternLength).map((row, i) => row[col - i]).join('') // Diagonal (top-right to bottom-left)
			];

			for (const pattern of patterns) {
				if (pattern.includes(intendedPattern)) count++;
			}
		}
	}

	return count;
}


module.exports = { findPattern }
