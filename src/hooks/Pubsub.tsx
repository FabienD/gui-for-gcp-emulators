import { IFormInput } from "../components/form/Emulator";

export function getTopics(settings: IFormInput) {
    return fetch(`http://${settings.host}:${settings.port}/v1/projects/fake/topics`)
        .then(res => res.json())
        .then(data => data)
}