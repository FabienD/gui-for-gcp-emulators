import { SettingsType } from "../components/emulator/Settings";
import { SubscriptionNameType, SubscriptionType } from "../components/pubsub/Subscription";
import { TopicNameType, TopicType } from "../components/pubsub/Topic";


export function getTopics(settings: SettingsType): Promise<Response> {
    return fetch(`http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/topics`);
}

export function createTopic(settings: SettingsType, topic: TopicType): Promise<Response> {
    return fetch(`http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/topics/${topic.name}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        }
    });
}

export function deleteTopic(settings: SettingsType, topicName: TopicNameType): Promise<Response> {
    return fetch(`http://${settings.host}:${settings.port}/v1/${topicName.name}`, {
        method: "DELETE"
    });
}

export function getSubscriptions(settings: SettingsType): Promise<Response> {
    return fetch(`http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/subscriptions`);
}

export function createSubscription(settings: SettingsType, subscription: SubscriptionType): Promise<Response> {
    return fetch(`http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/subscriptions/${subscription.name}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body:  JSON.stringify({
            "topic": subscription.topic,
            "pushConfig": {
                "pushEndpoint": subscription.pushConfig?.pushEndpoint,
            }
        })
    });
}

export function deleteSubscription(settings: SettingsType, subscriptionName: SubscriptionNameType): Promise<Response> {
    return fetch(`http://${settings.host}:${settings.port}/v1/${subscriptionName.name}`, {
        method: "DELETE",
    });
}