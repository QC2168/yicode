# yiapi 是什么？

> 注意：本项目开源仅供作者本人使用，没有使用教程文档，如擅自使用，后果自负。

中文名称 `易接口`。

是一个基于 `fastify` 深度封装，专注于 `接口` 开发的 `nodejs` 后端框架。

## 文档教程

[文档地址 https://yicode.tech](https://yicode.tech/2-开源/3-yiapi/1-基本简介/1-基本介绍.html)

## 功能特点

-   只需 `简单配置`，快速上手开发。
-   自动生成 `接口文档`，对接方便。
-   自带 `权限`、`角色`、`管理`、`日志`、`菜单`、`接口`、`字典`等基础功能。
-   自带 `邮件发送`，`文件上传`等功能。
-   自带请求 `日志打印` 和 `日志分割` 功能。
-   自带 `jwt` 鉴权机制。
-   自带`登录日志`，`邮件日志`功能。
-   自带配套的后台管理系统 `yiadmin`。
-   默认已处理后端的 `跨域` 问题。
-   优先使用 `缓存`，提供高性能接口。
-   默认提供 `静态文件托` 管功能。

## 仓库地址

点个星星，老铁。

[gitee - https://gitee.com/yicode-team/yicode](https://gitee.com/yicode-team/yicode)

[github - https://github.com/yicode-team/yicode](https://github.com/yicode-team/yicode)

## 作者简介

| 属性     | 值                                                    |
| -------- | ----------------------------------------------------- |
| 姓名     | `陈随易`                                              |
| 微信     | `c91374286`                                           |
| 扣扣     | `24323626(用得少)`                                    |
| 邮箱     | `bimostyle@qq.com`                                    |
| 知乎     | [知乎陈随易](https://www.zhihu.com/people/chensuiyi)  |
| 掘金     | [掘金陈随易](https://juejin.im/user/1239904846873326) |
| 码云     | [码云陈随易](https://gitee.com/banshiweichen)         |
| github   | [github 陈随易](https://github.com/chenbimo)          |
| 交流探讨 | 创建了 `全球顶级程序员微信交流群`，加入交流请加我微信 |

## 实际效果

使用 `yiapi` + `vue3` 研发的免费开源的 `(yiadmin) 易管理` 后台管理系统。

![随易科技](https://static.yicode.tech/images/202306/20230615215924.png)

## 适合场景

-   小型项目、博客系统、论坛系统、官网、后台管理等。
-   需要一个简单、轻量、快速、方便的 `nodejs` 接口开发框架。

## 注意事项

-   大型项目、特殊要求、高要求项目，请使用前仔细调研再做决定

## 待办计划

-   [ ] 限制 ip 访问
-   [x] 日志打印，不打印大数据
-   [ ] 实现单点登录
-   [x] 提供一个表字段配置，用于确认表配置是正常加载的
-   [ ] 增加对添加和更新数据时，只有 id 字段的问题处理

## 版权说明

`yiapi(易接口)` 使用 `Apache 2.0` 协议开源

> 一句话总结：开源不等于放弃版权，不可侵犯原作者版权，改动处要做说明，可以闭源使用。

拥有版权（Copyright）意味着你对你开发的软件及其源代码拥有著作权，所有权和其他法定权利，使用一个开源协议并不意味着放弃版权。

在 `Apache 2.0` 协议许可下，您可以：

-   **商业化使用**（这意味着，您可以出于商业目的使用这些源代码）
-   **再分发**（这意味着，您可以将源代码副本传输给其他任何人）
-   **修改**（这意味着，您可以修改源代码）
-   **专利使用**（这意味着，版权人明确声明授予您专利使用权）
-   **私人使用**（这意味着，您可以出于一切目的私下使用和修改源代码）

唯须遵守以下条款：

-   **协议和版权通知**（这意味着，软件中必须包含许可证和版权声明的副本）
-   **状态更改说明**（如果您更改软件，您应当提供适当的说明）

除此之外，该软件：

-   **提供责任限制**（版权人声明不对使用者造成的任何损失负责）
-   **限制商标使用** (不能使用版权人的商标)
-   **不提供任何担保**（版权人声明不为该软件的品质提供任何担保）

进一步说明：

1. 本软件又叫本 **作品**，可以是源码，也可以是编译或转换后的其他形式。**衍生作品** 是在本作品的基础上修改后的有原创性的工作成果。本作品的 **贡献者** 包括许可人和其他提交了贡献的人，以下统称 **我**。
2. 我授予你权利：你可以免费复制、使用、修改、再许可、分发本作品及衍生作品（可以不用公开源码）。
3. 如果本软件涉及我的专利（或潜在专利），我在此授予你专利许可，你可以永久性地免费使用此专利，用于制作、使用、出售、转让本作品。如果你哪天居然告本作品侵权，你的专利许可在你告我那天被收回。
4. 你在复制和分发本作品或衍生作品时，要满足以下条件。

    - 带一份本许可证。
    - 如果你修改了什么，要在改动的文件中有明显的修改声明。
    - 如果你以源码形式分发，你必须保留本作品的版权、专利、商标和归属声明。
    - 如果本作品带了 **NOTICE** 文件，你就得带上 **NOTICE** 文件中包含的归属声明。即便你的发布是不带源码的，你也得带上此文件，并在作品某处予以展示。
    - 你可以对自己的修改添加版权说明。对于你的修改或者整个衍生作品，你可以使用不同的许可，但你对本作品的使用、复制和分发等，必须符合本许可证规定。

5. 你提交贡献就表明你默认遵守本许可的条款和条件。当然，你可以和我签订另外的专门的条款。
6. 你不许使用我的商品名、商标、服务标志或产品名。
7. 本作品是 **按原样**（AS IS）提供的，没有任何保证啊，你懂的。
8. 我可不负任何责任。除非我书面同意，或者法律有这样的要求（例如对故意和重大过失行为负责）。
9. 你可以向别人提供保证，你可以向别人收费，但那都是你的事，别给我惹麻烦。

注意以上的 **我**，既包含了许可人，也包含了每位 **贡献者**。