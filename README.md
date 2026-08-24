# pi-skill-chrome-cdp-auto

[pi](https://github.com/badlogic/pi-mono) skill：通过 Chrome DevTools Protocol 控制本地 Chrome 浏览器——渲染后页面截图、无障碍树快照、导航、点击、输入、执行 JS、网络时序。

**与上游的差异（本 fork 的全部价值）：连不上浏览器时自动拉起专用调试实例，零配置、零授权弹窗。**

## 为什么有这个 fork

上游 [@howaboua/pi-skill-chrome-cdp](https://www.npmjs.com/package/@howaboua/pi-skill-chrome-cdp) 依赖 `chrome://inspect/#remote-debugging` 开关启用调试。该流程下 Chrome 会对每个新 attach 的 tab 弹 "Allow debugging" 确认框，且 daemon 空闲退出后再用要重新确认——每次使用都要点好几次"允许"。

本 fork 把启动逻辑内建到 CLI 里：

1. 优先探测 `CDP_PORT` / `9222`，再回退 `DevToolsActivePort`（带存活校验，陈旧的端口文件不会误导向死端口）
2. 全部失败 → 自动以独立 profile 启动专用调试实例并等待就绪（最多 15s）
3. 该实例的登录态跨重启持久保存

对使用者只有一条行为链：**连得上就连，连不上自己拉**。

## 安装

```bash
# npm（推荐）
pi install npm:pi-skill-chrome-cdp-auto

# 或从 GitHub 仓库
pi install git+https://github.com/heykb/pi-skill-chrome-cdp-auto
```

或手动 clone 后把 `skills/` 路径加入 `~/.pi/agent/settings.json` 的 `skills` 数组。

## 要求

- Node.js ≥ 22（使用内置 WebSocket）
- Chrome/Chromium

## 环境变量（均可选）

| 变量 | 默认 | 说明 |
|------|------|------|
| `CDP_PORT` | `9222` | 固定调试端口 |
| `CDP_AUTOLAUNCH_PORT` | `9222` | 自动拉起使用的端口 |
| `CDP_PROFILE_DIR` | `~/.cache/chrome-cdp-profile` | 专用实例的 user-data-dir |
| `CDP_NO_AUTOLAUNCH` | - | 设为 `1` 关闭自动拉起 |
| `CDP_PORT_FILE` | - | DevToolsActivePort 文件非标准位置 |

## 安全说明

- 自动拉起的实例开放 CDP 调试端口（绑定 `127.0.0.1`）。**本机任何进程都可以通过它读取页面内容、Cookie 并以你的身份操作浏览器**。仅在可信的个人设备上使用。
- 不要把日常浏览器的 profile 目录指向默认位置开调试口——Chrome 136+ 已禁止该组合，这正是本 fork 使用独立 profile 的原因。

## 平台支持

- ✅ macOS + Google Chrome 151 实测
- ⚠️ Linux / Windows 的浏览器路径分支已实现但未实测

## 归属

基于 [pasky/chrome-cdp-skill](https://github.com/pasky/chrome-cdp-skill) → [@howaboua/pi-skill-chrome-cdp](https://github.com/IgorWarzocha/howaboua-pi-stuff) 的 MIT fork，新增 auto-launch 与端口文件校验。见 [LICENSE](LICENSE)。
