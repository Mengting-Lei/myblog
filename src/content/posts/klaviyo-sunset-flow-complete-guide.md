---
title: "Klaviyo Sunset Flow完整搭建指南：从Segment到Suppress"
pubDatetime: 2026-07-07T12:00:00+08:00
author: "雷梦婷"
description: "手把手教你从零搭建 Klaviyo 的 Sunset Flow：如何定义 180 天无互动 Non-Buyer 的 Segment、设置一次性 Trigger、写低压力确认邮件、用 Conditional Split 判断真实互动，以及每月人工审核 suppress 的完整流程。"
tags:
  - 邮件营销
ogImage: /images/klaviyo-sunset-flow-complete-guide/klaviyo-sunset-flow-complete-guide.jpg
draft: false
---

你有没有遇到过这样的情况？列表人数一直在涨，但打开率好像在慢慢往下掉。

你开始怀疑是不是内容不够好，是不是发得太频繁，是不是 subject line 不够吸引人。你换了标题，换了模板，换了发送时间，但数据就是上不去。

这个时候，如果你去看 segment，会发现：列表里有很大一批人，半年没打开过任何一封邮件，没点过任何链接，也没回过网站。但他们还在列表里，每周照常收到 campaign。

这批人不会买，不会点，不会打开。他们唯一做的事情，就是拉低你的整体 engagement。

而 Google 和 Yahoo 现在很看重 engagement 信号。你发给越多不活跃的人，你的 sender reputation 就越差，邮件进垃圾箱的概率就越高。

Sunset Flow 就是用来解决这个问题的。

## 一、Sunset Flow 是什么？

一句话：针对长期不活跃的订阅者，发 1 封确认邮件，给他们最后一次选择留下的机会。没回应的，标记为 suppress candidate，定期清理。

它的目的很明确——list hygiene（列表健康度维护），保护 deliverability（到达率）。

这里有个容易搞混的地方：Sunset Flow 和 Winback Flow 不一样。

Winback 是"我们想把你拉回来"，可以放折扣、发 2-3 封。Sunset 是"你还想不想留下来"，不放折扣、不追收入、只发 1 封。

Sunset 的判断目标是"这个人还想不想留下"，不是"这个人会不会买"。

完整流程长这样：

长期无互动用户进入 Sunset Segment → 收到 1 封低压力确认邮件 → 7 天内有真实互动 → 保留 → 7 天内没有真实互动 → 标记为 suppress candidate → 每月人工审核并 suppress

接下来从零开始，一步步拆解怎么在 Klaviyo 里搭这个 Flow。

## 二、搭建前的两个判断

在动手之前，先想清楚两件事。

第一件：你的品类购买周期是什么样的？

低客单高频品类（比如日用品、快消），用户决策快，180 天没互动基本可以判定为流失。

高客单低频品类（比如家具、户外建筑、高端电子），用户决策周期长，可能半年不买但仍然有兴趣。这时候时间窗口可能需要拉长，或者至少把 Buyer 和 Non-Buyer 分开处理。

第二件：要不要把 Buyer 和 Non-Buyer 分开？

建议分开。

Non-Buyers（从没买过的人）可以更积极地清理。他们没给你带来过收入，长期不互动，清理风险低。

Past Buyers（买过的人）要更保守。尤其高客单品类，买过一次的人可能一年内不需要再买主产品，但仍然可能有配件、复购、推荐、季节性需求。

默认建议：

- Non-Buyers → 180 天清理
- Past Buyers → 365 天，更保守
- VIP / High-LTV Buyers → 不直接 suppress，先标记 dormant

这篇文章默认讲 Non-Buyers 版本。

## 三、Step 1：创建 Sunset Eligible Segment

这一步是整个 Flow 的地基。Segment 定义错了，后面全白搭。

Segment 名称：

```
Sunset Eligible | 180D Unengaged | Non-Buyers
```

Segment 条件：

```
If someone can or cannot receive marketing
Person can receive email marketing
because person subscribed

AND

What someone has done
Received Email at least 5 times over all time

AND

What someone has done
Opened Email zero times in the last 180 days

AND

What someone has done
Clicked Email zero times in the last 180 days

AND

What someone has done
Active on Site zero times in the last 180 days

AND

What someone has done
Placed Order zero times over all time

AND

Properties about someone / profile condition
Created profile at least 180 days ago
OR
Subscribed to email marketing at least 180 days ago
```

每个条件为什么这么设?

**Person can receive email marketing because person subscribed**

确保你清理的是合法订阅者，不是已经被 unsubscribe 或 suppressed 的人。

**Received Email at least 5 times over all time**

这条很容易被漏掉，但非常重要。你不想清理一个刚订阅两周、才收到 1 封邮件的人——他们可能只是还没来得及看。至少收到 5 封邮件还没互动，才说明是真的不感兴趣。

**180 天 no open / click / site active**

三个维度同时为 0，确保是全面沉默，不是某个通道出了问题。

**Placed Order zero times over all time**

这是 Non-Buyer 限定的条件。买过的人不进这个 Segment。

⚠️ **踩坑提醒**：

很多人会漏掉 "Received Email at least 5 times" 和 "Profile created at least 180 days ago" 这两条。少了它们，新订阅者可能被误伤。

## 四、Step 2：创建 Flow + Trigger 设置

**Flow 名称**

```
Sunset Flow | 180D Unengaged | Non-Buyers
```

**Trigger**

```
Trigger: Added to segment
Segment: Sunset Eligible | 180D Unengaged | Non-Buyers
```

**Re-entry**

```
No re-entry
```

Sunset Flow 是一次性清理机制。同一个人不应该反复进出这个 Flow。

⚠️ **Trigger Profile Filters 必须留空**

这是最容易踩坑的地方。

如果你后面打算用 Conditional Split 来判断用户有没有互动（后面会讲），那 Trigger Profile Filters 一定要留空。

不要在这里加：

```
Opened Email zero times since starting this flow
Clicked Email zero times since starting this flow
Active on Site zero times since starting this flow
```

为什么？

因为这些条件如果放在 Flow-level filters 里，用户一旦有了互动（比如点了邮件），可能会在后面的 Property Update 之前被 skip 掉，而不是进入你想要的 YES / NO 分流。

正确做法：

把互动判断放到后面的 Conditional Split 里做，Trigger 这里保持干净。

## 五、Step 3：写 Sunset 邮件

**Flow 结构**

先看整体结构：

```
Trigger: Added to sunset segment
  ↓
Time Delay: Wait 0 days until 10:00 AM
  ↓
Email: Sunset Non-Buyers Email 1
  ↓
Time Delay: Wait 7 days
  ↓
Conditional Split: Did they re-engage?
  YES path → Profile Property Update
  NO path → Profile Property Update
```

**邮件设计原则**

这封邮件不要做成常规 campaign。

不要放促销图，不要堆产品，不要放 category grid，不要放 referral block。

它应该看起来像一个真人发的简单邮件。推荐用 plain-text style 或极简 branded email。

为什么？

因为这封邮件的目的是问一个问题——"你还想不想留下来？" 它越简单、越低压，回应率越高。做成促销邮件反而让人觉得你在卖东西。

**Subject Line**

几个选项：

```
Still want to hear from us?
```

通用版本，简单直接。

```
Should we keep sending these?
```

更直接，适合语气偏随意的品牌。

```
Still planning your outdoor space?
```

品牌化版本，结合用户场景。

**Preview Text**

```
Let us know if you'd like to stay on the list.
```

或者：

```
One click and you'll keep hearing from us.
```

**邮件文案模板**

通用模板：

```
Hi there,

It's been a while since we've heard from you.

No hard feelings. Sometimes the timing just isn't right.

But if you still want [品牌提供的价值], we'd love to keep sending you:

• [价值点 1]
• [价值点 2]
• [价值点 3]

If you'd like to stay on the list, click below.

[Keep Me Subscribed]

If not, no worries. We'll stop sending emails so your inbox stays a little cleaner.

P.S. You can always visit us here.
```

举个实际例子。比如一个户外家居品牌，邮件可以写成：

```
Hi there,

It's been a while since we've heard from you.

No hard feelings. Backyard projects usually happen
when the timing is right.

But if you still want ideas for making your outdoor space
more comfortable, we'd love to keep sending you:

• Gazebo and pergola inspiration
• Backyard setup tips
• New outdoor living arrivals
• Occasional offers on structures and accessories

If you'd like to stay on the list, click below.

[Keep Me Subscribed]

If not, no worries. We'll stop sending emails so your inbox stays a little cleaner.

P.S. Still planning your setup?
Tap above to stay on the list — or browse our collection here.
```

注意邮件里的价值点要根据品牌调整。

不要写 "new products and discounts" 这种通用的。写具体的——用户留下来的理由是什么？是灵感、是技巧、是新到货、还是偶尔的优惠？

**CTA 设置**

主 CTA 文案：

```
Keep Me Subscribed
```

Button URL 用 Klaviyo 的 update_property_link：

```
{% update_property_link 'sunset_status' 'keep_subscribed' 'https://你的品牌首页.com/pages/thanks-for-staying' %}
```

用户点击后，Klaviyo 会自动写入 profile property：

```
sunset_status = keep_subscribed
```

然后跳转到你的"thanks for staying" 页面。

这个按钮很关键——它是用户主动选择留下的信号。后面判断 re-engage 的时候会用到。

"thanks for staying" 页面，可以在 Shopify 后台创建 page，或者用 Klaviyo，在 Website Tab 下面有个 Landing page 的功能。

## 六、Step 4：7 天后 Conditional Split 判断

**Time Delay**

邮件发出后，加一个等待：

名称：

```
Wait 7 days
```

3-7 天都可以，默认用 7 天。给用户足够的时间看到邮件、点击、回网站。

**Conditional Split**

名称：

```
Did they re-engage?
```

**条件设置为 ANY / OR 逻辑：**

```
Properties about someone
sunset_status equals keep_subscribed

OR

What someone has done
Clicked Email at least once since starting this flow

OR

What someone has done
Active on Site at least once since starting this flow

OR

What someone has done
Placed Order at least once since starting this flow
```

⚠️ **为什么不把 Opened Email 算进去**

这是很多人会问的问题。

Open tracking 现在不够干净。Apple 的 Mail Privacy Protection（MPP）会让很多邮件显示"已打开"，但用户其实并没有真正打开。如果用 open 来判断 re-engage，你会保留一大批实际上没有互动的人。

Sunset 的判断标准应该是"真实兴趣信号"——主动点击留下、点击邮件链接、回网站、下单。这些都是需要用户主动操作的行为，比 open 可靠得多。

## 七、Step 5：Property Update（YES / NO 双路径）

Conditional Split 之后，YES 和 NO 两条路径分别打不同的 property。

**YES Path：互动过 / 选择留下**

```
unengaged = false
sunset_outcome = reengaged
sunset_reason = reengaged_after_sunset
```

**NO Path：没有真实互动**

```
unengaged = true
sunset_outcome = suppress_candidate
sunset_reason = 180d_unengaged_nonbuyer
```

⚠️ **为什么不直接自动 suppress**

Suppress 是一个不太好逆转的动作。如果在 Flow 里直接 suppress，万一 Segment 条件设错了、或者用户最近刚活跃但数据还没同步，就会误伤。

更稳的做法是：Flow 自动打 property → 进入 Suppress Candidate Segment → 每月人工审核 → 批量 suppress。

## 八、Step 6：创建 Suppress Candidate Segment + 每月清理

Flow 上线后，等第一批人走完 7 天，就可以创建这个 Segment 了。

**Segment 名称**

```
Sunset Suppress Candidates | Non-Buyers
```

**Segment 条件**

```
Properties about someone
unengaged equals True

AND

Properties about someone
sunset_outcome equals suppress_candidate

AND

Properties about someone
sunset_reason equals 180d_unengaged_nonbuyer

AND

What someone has done
Placed Order zero times over all time

AND

If someone can or cannot receive marketing
Person can receive email marketing
because person subscribed

AND

What someone has done
Clicked Email zero times in the last 7 days

AND

What someone has done
Active on Site zero times in the last 7 days
```

⚠️ **不要加 "Opened Email zero times" 作为 suppress 条件。**

和前面说的一样，open 信号不够干净，最终清理判断不要依赖它。

**每月操作流程：**

1. 打开 Segment: Sunset Suppress Candidates | Non-Buyers
2. 检查人数是否异常  
   如果突然暴涨，先暂停，不要直接 suppress
3. 抽查 5-10 个 profiles  
   确认他们确实没有 recent click / site active / order
4. Export segment
5. 在 Klaviyo 里批量 suppress
6. 记录本月 suppress 数量
7. 观察后续 2-4 周 campaign open rate / click rate / spam complaint / bounce rate

如果 deliverability 明显变差，可以每 2 周检查一次。正常情况下每月 1 次就够了。

## 九、上线前 QA Checklist

上线前逐项检查，直接用：

**Segment QA**

- [ ] 使用 Person can receive email marketing because person subscribed
- [ ] 加了 Received Email at least 5 times
- [ ] 加了 180D no open / click / site active
- [ ] Non-buyers 使用 Placed Order zero times over all time
- [ ] 加了 Created profile / subscribed at least 180 days ago
- [ ] 没有误包含 buyers / VIP

**Flow QA**

- [ ] Trigger = Added to sunset segment
- [ ] Re-entry = No re-entry
- [ ] Trigger Profile Filters 为空
- [ ] Email 前 wait until 10:00 AM（这个时间改为品牌自己的客户活跃时间）
- [ ] Email 后 wait 7 days（3-7天都可以）
- [ ] Conditional Split 使用 OR 逻辑
- [ ] Split 包含 sunset_status / clicked email / active on site / placed order
- [ ] YES path property update 正确
- [ ] NO path property update 正确

**Email QA**

- [ ] Subject line 清楚
- [ ] Preview text 清楚
- [ ] CTA = Keep Me Subscribed
- [ ] Button URL 使用 update_property_link
- [ ] Button 跳转 URL 正确
- [ ] 邮件没有 category grid / referral block / product grid
- [ ] Footer / unsubscribe / address 正常
- [ ] Mobile preview 正常
- [ ] Test email 已发送

**Property QA**

- [ ] 测试点击后能写入 sunset_status = keep_subscribed
- [ ] YES path 写入 unengaged = false
- [ ] YES path 写入 sunset_outcome = reengaged
- [ ] NO path 写入 unengaged = true
- [ ] NO path 写入 sunset_outcome = suppress_candidate
- [ ] NO path 写入 sunset_reason = 180d_unengaged_nonbuyer

## 写在最后

Sunset Flow 不会给你带来一分钱的收入。它的 KPI 不是 revenue，是 deliverability。

但如果不做这件事，你的 Welcome Flow、Abandoned Cart、Winback——所有赚钱的 Flow 都会慢慢被拖累。因为邮件越来越难进收件箱，能收到的人就越来越少。

Sunset Flow 就像是给邮件列表做体检。定期把不活跃的人清理出去，留下的都是真正想看你邮件的人。列表小一点没关系，健康比体量重要。

最后，一句话总结 Sunset Flow 的结构：长期无互动用户 → 发 1 封确认邮件 → 7 天内有真实互动就保留 → 没有就标记 suppress candidate → 每月审核并 suppress。

如果你在搭建过程中遇到问题，或者想聊聊你的品牌适不适合用这个 Flow，欢迎链接我~

---

我是梦婷，一名品牌邮件营销增长顾问。帮助出海与海外华人品牌，通过全链路邮件营销（策略+内容+自动化+设计一体化），在广告成本上涨的环境下，持续放大复购与利润。
