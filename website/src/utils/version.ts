export type Version = [number, number, number];

export function parseVersion(versionStr: string): Version {
	return versionStr.split('.').map((token) => parseInt(token)) as Version;
}

export function compareVersion(versionA?: Version, versionB?: Version): number {
	if (versionA == null || versionB == null) {
		return 0;
	}
	const [majorA, minorA, patchA] = versionA;
	const [majorB, minorB, patchB] = versionB;
	if (majorA !== majorB) return majorA - majorB;
	if (minorA !== minorB) return minorA - minorB;
	if (patchA !== patchB) return patchA - patchB;
	return 0;
}

export function compareVersionStr(a?: string, b?: string): number {
	if (a == null || b == null) {
		return 0;
	}
	const versionA = parseVersion(a);
	const versionB = parseVersion(b);
	return compareVersion(versionA, versionB);
}
