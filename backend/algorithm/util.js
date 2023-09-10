function findPattern(board, intendedPattern) {
	let count = 0;
	for (let row = 0; row < 15; row++) {
		for (let col = 0; col < 15; col++) {
			const patterns = [
				board[row].slice(col, col + 5).join(''), // Horizontal
				board.map(row => row[col]).slice(row, row + 5).join(''), // Vertical
				board.slice(row, row + 5).map((row, i) => row[col + i]).join(''), // Diagonal (top-left to bottom-right)
				board.slice(row, row + 5).map((row, i) => row[col - i]).join('') // Diagonal (top-right to bottom-left)
			];

			for (const pattern of patterns) {
				if (pattern.includes(intendedPattern)) count++;
			}
		}
	}


	return count;
}


module.exports = { findPattern }
