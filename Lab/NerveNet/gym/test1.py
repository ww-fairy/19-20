import numpy as np
import tensorflow as tf
import gym


class PolicyGradient(object):
    def __init__(self,
                 n_actions,
                 n_features,
                 learning_rate=0.01,
                 reward_decay=0.95):
        self.n_actions = n_actions
        self.n_features = n_features
        self.lr = learning_rate
        self.gamma = reward_decay
        self.ep_obs, self.ep_as, self.ep_rs = [], [], []

        self.tf_obs = tf.placeholder(tf.float32, [None, self.n_features])
        self.tf_acts = tf.placeholder(tf.int32, [None, ])
        self.tf_vt = tf.placeholder(tf.float32, [None, ])

        hidden_layer = tf.layers.dense(
            inputs=self.tf_obs,
            units=10,
            activation=tf.nn.tanh,  # 比使用relu函数效果更好些
            kernel_initializer=tf.random_normal_initializer(mean=0.0, stddev=0.3),
            bias_initializer=tf.constant_initializer(0.1)
        )

        output_layer = tf.layers.dense(
            inputs=hidden_layer,
            units=self.n_actions,
            kernel_initializer=tf.random_normal_initializer(mean=0.0, stddev=0.3),
            bias_initializer=tf.constant_initializer(0.1),
        )
        self.action_prob = tf.nn.softmax(output_layer)
        cross_entropy = tf.nn.sparse_softmax_cross_entropy_with_logits(logits=output_layer, labels=self.tf_acts)
        self.loss = tf.reduce_mean(cross_entropy * self.tf_vt)
        self.train_op = tf.train.AdamOptimizer(self.lr).minimize(self.loss)

        self.sess = tf.Session()
        self.sess.run(tf.global_variables_initializer())

    # 基于概率选择行为
    def choose_action(self, observation):
        prob_weights = self.sess.run(self.action_prob, feed_dict={self.tf_obs: observation[np.newaxis, :]})
        action = np.random.choice(np.arange(prob_weights.shape[1]), p=prob_weights.ravel())
        return action

    def store_transition(self, s, a, r):
        self.ep_obs.append(s)
        self.ep_as.append(a)
        self.ep_rs.append(r)

    def learn(self):
        discounted_ep_rs_norm = self.discount_norm_rewards()
        self.sess.run(self.train_op, feed_dict={
            self.tf_obs: np.vstack(self.ep_obs),  # shape=[None, n_obs]
            self.tf_acts: np.array(self.ep_as),  # shape=[None, 1]
            self.tf_vt: discounted_ep_rs_norm,  # shape=[None, 1]
        })
        self.ep_obs, self.ep_as, self.ep_rs = [], [], []
        return discounted_ep_rs_norm

    def discount_norm_rewards(self):
        # 存储action的直接价值和潜在价值
        discounted_ep_rs = np.zeros_like(self.ep_rs)
        running_add = 0
        for t in reversed(range(len(self.ep_rs))):
            running_add = running_add * self.gamma + self.ep_rs[t]
            discounted_ep_rs[t] = running_add
        # normalize episode rewards
        discounted_ep_rs -= np.mean(discounted_ep_rs)
        discounted_ep_rs /= np.std(discounted_ep_rs)
        return discounted_ep_rs


env = gym.make('CartPole-v0').unwrapped
rl = PolicyGradient(
    n_actions=env.action_space.n,
    n_features=env.observation_space.shape[0],
    learning_rate=0.02,
    reward_decay=0.99
)

max_episode = 120
for episode in range(max_episode):
    observation = env.reset()
    ep_rewards = 0
    while True:
        env.render()
        action = rl.choose_action(observation)
        observation_, reward, done, info = env.step(action)
        ep_rewards += reward
        rl.store_transition(observation, action, reward)
        if done:
            print('episode: ', episode, 'reward: ', ep_rewards)
            vt = rl.learn()
            break
        observation = observation_

