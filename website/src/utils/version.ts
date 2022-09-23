export type Version = [number, number, number];

export function parseVersion(versionStr: string): Version {
	return versionStr.split('.').map((token) => parseInt(token)) as Version;
}

export function compareVersions(
	versionA?: Version,
	versionB?: Version,
): number {
	if (versionA === undefined || versionB === undefined) {
		return 0;
	}
	const [majorA, minorA, patchA] = versionA;
	const [majorB, minorB, patchB] = versionB;
	if (majorA !== majorB) return majorA - majorB;
	if (minorA !== minorB) return minorA - minorB;
	if (patchA !== patchB) return patchA - patchB;
	return 0;
}

export function compareVersionStrings(
	versionA?: string,
	versionB?: string,
): number {
	if (versionA === undefined || versionB === undefined) {
		return 0;
	}
	const [majorA, minorA, patchA] = parseVersion(versionA);
	const [majorB, minorB, patchB] = parseVersion(versionB);
	if (majorA !== majorB) return majorA - majorB;
	if (minorA !== minorB) return minorA - minorB;
	if (patchA !== patchB) return patchA - patchB;
	return 0;
}
