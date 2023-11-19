import { SettingsType } from "../components/emulator/Settings";
import { SubscriptionType } from "../components/pubsub/Subscription";
import { TopicType } from "../components/pubsub/Topic";


export function getTopics(settings: SettingsType): Promise<Response> {
    return fetch(`http://${settings.host}:${settings.port}/v1/projects/fake/topics`);
}

export function createTopic(settings: SettingsType, topic: TopicType): Promise<Response> {
    return fetch(`http://${settings.host}:${settings.port}/v1/projects/fake/topics/${topic.name}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
          },
    });
}

export function deleteTopic(settings: SettingsType, topic: TopicType): Promise<Response> {
    return fetch(`http://${settings.host}:${settings.port}/v1/${topic.name}`, {
        method: "DELETE"
    });
}

export function getSubscriptions(settings: SettingsType): Promise<Response> {
    return fetch(`http://${settings.host}:${settings.port}/v1/projects/fake/subscriptions`);
}

export function createSubscription(settings: SettingsType, subscription: SubscriptionType): Promise<Response> {
    return fetch(`http://${settings.host}:${settings.port}/v1/projects/fake/subscriptions/${subscription.name}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body:  JSON.stringify({
            "topic": subscription.topic
        })
    });
}

export function deleteSubscription(settings: SettingsType, subscription: SubscriptionType): Promise<Response> {
    return fetch(`http://${settings.host}:${settings.port}/v1/${subscription.name}`, {
        method: "DELETE",
    });
}