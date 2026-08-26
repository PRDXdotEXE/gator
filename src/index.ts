import { readConfig, setUser } from "./config";

function main() {
    setUser("Pratik");
    const config = readConfig();
    console.log(config);
}

main();
