import { MessageApp } from "@/components/elements/message"
import { ModeToggle } from "@/components/elements/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BellOff,
  EllipsisVertical,
  MessageCircleQuestion,
  MessageCircleWarning,
  MessageCircleX,
  Phone,
  User,
  Video
} from "lucide-react";

interface MessagePageProps {
  params: {
    id: string
  }
}

export default function MessageDetailPage({ params }: MessagePageProps) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 border-b items-center gap-2 ease-linear">
        <div className="flex flex-1 items-center justify-between gap-3 px-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 p-0 relative cursor-pointer"
          >
            <Avatar className="h-9 w-9 rounded-md">
              <AvatarImage src="" alt="JG" />
              <AvatarFallback className="rounded-md">JG</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background bg-green-500"></div>
          </Button>

          <div className="h-9 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm truncate">Japtor Gorthenburg</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600 truncate">
                {true ? "Hoạt động" : 1 > 0 ? "Ngoại tuyến" : 1 > 2 ? "Không hoạt động" : "Ẩn trạng thái"}
              </p>
            </div>
          </div>

          {/* <div className={`flex gap-2 mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            {!isOwn && (
              <Avatar className="w-8 h-8 mt-1">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}

            <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
              <div
                className={`px-4 py-2 rounded-2xl ${isOwn
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <span className="text-xs text-gray-500">
                  {formatMessageTime(message.timestamp)}
                </span>
                {isOwn && (
                  <div className="flex">
                    <div className="w-4 h-4 text-blue-500">
                      <svg viewBox="0 0 16 16" fill="currentColor">
                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isOwn && (
              <Avatar className="w-8 h-8 mt-1 order-2">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
          </div> */}

          {/* <View className="flex-1">
            <View className="mb-1 flex-row items-start justify-between">
              <View className="flex-row items-center">
                <Text
                  className="mr-2 font-semibold text-foreground"
                  numberOfLines={1}
                >
                  {chat.name}
                </Text>
              </View>
            </View>


            <View className="flex-row justify-between items-center gap-2">
              <Text
                className="text-sm text-muted-foreground flex-1"
                numberOfLines={1}
              >
                {chat.lastMessage}
              </Text>
              <View className="flex-row items-center">
                <Icon
                  as={Dot}
                  className="h-4 w-4"
                />
                <Text
                  className="text-sm text-muted-foreground"
                  numberOfLines={1}
                >
                  {chat.time}
                </Text>
              </View>
            </View>
          </View>
          <View>
            {chat.unreadCount > 0 ? (
              <Badge className="bg-background size-10 p-0 rounded-full">
                <View
                  className="bg-destructive h-4 w-4 rounded-full border-2 border-background"
                />
              </Badge>
            ) : (
              <Badge className="bg-background size-10 p-0 rounded-full">
                
                <Text
                  className="bg-background h-4 w-4 rounded-full border-background"
                >
                  <Icon
                    as={BellOff}
                    className="w-4 h-4 text-foreground"
                  />
                </Text>
              </Badge>
            )}
          </View> */}

          <div className="items-center">
            <div className="ml-auto flex items-center space-x-2">
              <ModeToggle />
              <Button variant="ghost" size="icon" className="relative">
                <Phone className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Video className="h-6 w-6" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <EllipsisVertical className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="">
                  {/* <DropdownMenuLabel>Thông báo</DropdownMenuLabel> */}
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Xem tài khoản
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BellOff className="mr-2 h-4 w-4" />
                      Tắt thông báo
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageCircleX className="mr-2 h-4 w-4" />
                      Chặn người dùng
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageCircleQuestion className="mr-2 h-4 w-4" />
                      Xoá đoạn chat
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageCircleWarning className="mr-2 h-4 w-4" />
                      Báo cáo
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow p-0">
        <MessageApp initialConversationId={params.id} />
      </main>
    </div>
  );
}