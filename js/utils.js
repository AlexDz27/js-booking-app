function insertSubstringInString (string, substring, pos) {
	return string.slice(0, pos) + substring + string.slice(pos);
}