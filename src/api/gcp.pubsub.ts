import { IFormSettings } from "../components/emulator/Settings";
import { IFormPubsubTopic } from "../components/pubsub/TopicCreate";

export function getTopics(settings: IFormSettings): Promise<Response> {
    return fetch(`http://${settings.host}:${settings.port}/v1/projects/fake/topics`);
}

export function createTopic(settings: IFormSettings, topic: IFormPubsubTopic): Promise<Response> {
    return fetch(`http://${settings.host}:${settings.port}/v1/projects/fake/topics/${topic.name}`, {
        method: "PUT"
    });
}

export function deleteTopic(settings: IFormSettings, topic: IFormPubsubTopic): Promise<Response> {
    return fetch(`http://${settings.host}:${settings.port}/v1/${topic.name}`, {
        method: "DELETE"
    });
}

export function getSubscriptions(settings: IFormSettings): Promise<Response> {
    return fetch(`http://${settings.host}:${settings.port}/v1/projects/fake/subscriptions`);
}