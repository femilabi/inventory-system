import CONFIGURATIONS from "../config";


function config(location: string) {
    let current_path: any = CONFIGURATIONS;

    const paths = location.split(".");
    if (!(paths.length > 0)) return "";
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i].toUpperCase();
        if (!(path && current_path[path])) {
            current_path = "";
            break;
        }
        current_path = current_path[path];
    }
    return current_path;
}

export { config };