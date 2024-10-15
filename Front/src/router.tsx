import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/layout.tsx";
import NotFound from "./pages/notFound.tsx";

import Access from "./pages/access/access.tsx";
import Data from "./pages/access/data.tsx";
import Signup from "./pages/access/signup.tsx";
import Signin from "./pages/access/signin.tsx";

import Change from "./pages/change/change.tsx";
import PassSettings from "./pages/change/passSettings.tsx";
import PassToExchange from "./pages/change/passToExchange.tsx";
import WaitingTime from "./pages/change/waitingTime.tsx";
import Exchange from "./pages/change/exchange.tsx";

import Chats from "./pages/chats/chatList.tsx";
import Messages from "./pages/chats/messages/messages.tsx";
import ChatSettings from "./pages/chats/settings.tsx";
import NewChat from "./pages/chats/newChat.tsx";

import Settings from "./pages/settings/settings.tsx";
import MyAccess from "./pages/settings/myAccess/myAccess.tsx";
import EditNickname from "./pages/settings/myAccess/editNickname.tsx";
import EditPassword from "./pages/settings/myAccess/editPassword.tsx";
import Language from "./pages/settings/language.tsx";
import Database from "./pages/settings/database/database.tsx";
import Product from "./pages/settings/database/product.tsx";
import Order from "./pages/settings/database/order.tsx";
import Number from "./pages/settings/database/number.tsx";
import Search from "./pages/settings/database/search.tsx";
import Notifications from "./pages/settings/notifications.tsx";
import Feedback from "./pages/settings/feedback.tsx";
import BugReport from "./pages/settings/bugReport.tsx";
import ChatId from "./pages/change/chatId.tsx";
import { VerificationPhrase } from "./pages/change/verificationPhrase.tsx";
import { ExchangeLink } from "./pages/change/exchangeLink.tsx";

export const routes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/access",
        element: <Access />,
        children: [
          { path: ":data", element: <Data /> },
          { path: "signup", element: <Signup /> },
          { path: "signin", element: <Signin /> },
        ],
      },
      {
        path: "/change",
        element: <Change />,
        children: [
          { path: "password-settings", element: <PassSettings /> },
          { path: "password-exchange", element: <PassToExchange /> },
          { path: "waiting-time", element: <WaitingTime /> },
          { path: "chat-id", element: <ChatId /> },
          { path: "exchange", element: <Exchange /> },
          { path: "link/:link", element: <ExchangeLink /> },
          { path: "verification-phrase", element: <VerificationPhrase /> },
        ],
      },
      {
        path: "/chats",
        element: <Chats />,
        children: [
          { path: ":id", element: <Messages /> },
          { path: "settings/:id", element: <ChatSettings /> },
          { path: "new-chat", element: <NewChat /> },
        ],
      },
      {
        path: "/settings",
        element: <Settings />,
        children: [
          { path: "my-access", element: <MyAccess /> },
          { path: "edit-nickname", element: <EditNickname /> },
          { path: "edit-password", element: <EditPassword /> },
          { path: "language", element: <Language /> },
          { path: "database", element: <Database /> },
          { path: "db-product", element: <Product /> },
          { path: "db-order", element: <Order /> },
          { path: "db-number", element: <Number /> },
          { path: "db-search", element: <Search /> },
          { path: "notifications", element: <Notifications /> },
          { path: "feedback", element: <Feedback /> },
          { path: "bug-report", element: <BugReport /> },
        ],
      },
    ],
  },
];
const router = createBrowserRouter(routes);

export default router;
