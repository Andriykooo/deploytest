const channelInstances = {};

export const getSingletonChannel = (name) => {
  if (!channelInstances[name]) {
    channelInstances[name] =
      typeof window !== "undefined" ? new BroadcastChannel(name) : null;
  }
  return channelInstances[name];
};
