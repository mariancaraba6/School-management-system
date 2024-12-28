import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getChatMessagesRequest, sendMessageRequest } from "../../api/chat";
import LoadingPage from "../../LoadingPage";

const Chat = () => {
  const [conversations, setConversations] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const fetchChatMessages = useCallback(async () => {
    setConversations(null);
    try {
      console.log("Fetching chat messages...");
      const response = await getChatMessagesRequest();
      if (response.status !== 200) {
        throw new Error(
          `Status retrieving the chat messages: ${response.status}`
        );
      }
      const data = await response.json();
      console.log("Chat messages: ", data);
      setConversations(data["chats"]);
      setActiveConversation((x) =>
        x ? data["chats"].find((c) => c.id === x.id) : null
      );
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  }, []);

  const sendChatMessage = useCallback(async (receiver_id, message) => {
    try {
      console.log(`Sending message to ${receiver_id}: ${message}`);
      const response = await sendMessageRequest(receiver_id, message);
      if (response.status !== 200) {
        throw new Error(`Status sending message: ${response.status}`);
      }
      if (response.status === 200) {
        console.log("Message sent successfully.");
        return;
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, []);

  useEffect(() => {
    fetchChatMessages();
  }, [fetchChatMessages]);

  const handleRefresh = () => {
    fetchChatMessages();
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    sendChatMessage(activeConversation.id, newMessage);
    const updatedConversations = conversations.map((conversation) => {
      if (conversation.id === activeConversation.id) {
        return {
          ...conversation,
          messages: [
            ...conversation.messages,
            { sender_id: "You", message: newMessage },
          ],
        };
      }
      return conversation;
    });

    setConversations(updatedConversations);

    const updatedActiveConversation = {
      ...activeConversation,
      messages: [
        ...activeConversation.messages,
        { sender_id: "You", message: newMessage },
      ],
    };
    setActiveConversation(updatedActiveConversation);

    setNewMessage("");
  };

  if (conversations === null) {
    return <LoadingPage />;
  }

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.type === (tabIndex === 0 ? "student" : "professor") &&
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h4"
          gutterBottom
          color="compl"
          sx={{ fontWeight: "bold" }}
        >
          Chat
        </Typography>
        <IconButton
          onClick={handleRefresh}
          sx={{
            color: "#008060",
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          backgroundColor: "#ffe5c0",
        }}
      >
        {/* Conversations List */}
        <Box
          sx={{
            width: "30%",
            borderRight: "1px solid #ccc",
            padding: 2,
            backgroundColor: "#ffffff",
            overflowY: "auto",
            boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#008060",
                fontWeight: "bold",
              }}
            >
              Conversations
            </Typography>
          </Box>

          {/* Tabs to Switch Between Students and Teachers */}
          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => setTabIndex(newValue)}
            variant="fullWidth"
            textColor="#008060"
            indicatorColor="#008060"
            sx={{
              marginBottom: 2,
              "& .MuiTabs-indicator": {
                backgroundColor: "#008060",
              },
            }}
          >
            <Tab
              label="Students"
              sx={{ color: tabIndex === 0 ? "#008060" : "#666" }}
            />
            <Tab
              label="Professors"
              sx={{ color: tabIndex === 1 ? "#008060" : "#666" }}
            />
          </Tabs>

          <TextField
            fullWidth
            variant="outlined"
            placeholder={`Search ${
              tabIndex === 0 ? "students" : "professors"
            }...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              marginBottom: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: "#f3f8ff",
              },
            }}
          />
          <List>
            {filteredConversations.map((conversation) => (
              <React.Fragment key={conversation.id}>
                <ListItem
                  onClick={() => setActiveConversation(conversation)}
                  selected={activeConversation?.id === conversation.id}
                  sx={{
                    borderRadius: "10px",
                    marginBottom: 1,
                    backgroundColor:
                      activeConversation?.id === conversation.id
                        ? "#e0f7fa"
                        : "#ffffff",
                    transition: "background-color 0.2s",
                  }}
                >
                  <ListItemText
                    primary={conversation.name}
                    primaryTypographyProps={{
                      style: {
                        fontWeight: "bold",
                        color:
                          activeConversation?.id === conversation.id
                            ? "#008060"
                            : "#444",
                      },
                    }}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>

        {/* Chat Window */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: 2,
            backgroundColor: "#f3f8ff",
          }}
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 2,
                  backgroundColor: "#ffffff",
                  padding: 2,
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ color: "#008060", fontWeight: "bold" }}
                >
                  {activeConversation.name}
                </Typography>
              </Box>

              {/* Messages Display */}
              <Paper
                elevation={3}
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  padding: 2,
                  marginBottom: 2,
                  borderRadius: "10px",
                  backgroundColor: "#ffffff",
                }}
              >
                <List>
                  {activeConversation.messages.map((message, index) => (
                    <React.Fragment key={index}>
                      <ListItem
                        sx={{
                          justifyContent:
                            message.sender_id !== activeConversation.id
                              ? "flex-end"
                              : "flex-start",
                          textAlign:
                            message.sender_id !== activeConversation.id
                              ? "right"
                              : "left",
                          padding: "0",
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                backgroundColor:
                                  message.sender_id !== activeConversation.id
                                    ? "#008060"
                                    : "#f1f1f1",
                                color:
                                  message.sender_id !== activeConversation.id
                                    ? "#ffffff"
                                    : "#000000",
                                padding: "10px",
                                borderRadius: "10px",
                                display: "inline-block",
                                maxWidth: "80%",
                                wordWrap: "break-word",
                              }}
                            >
                              {message.message}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              sx={{
                                color:
                                  message.sender_id !== activeConversation.id
                                    ? "#008060"
                                    : "#666666",
                                fontSize: "0.8rem",
                                marginTop: "4px",
                              }}
                            >
                              {message.sender_id !== activeConversation.id
                                ? "You"
                                : activeConversation.id}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Paper>

              {/* Input for New Message */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  sx={{
                    marginRight: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                      backgroundColor: "#ffffff",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendMessage}
                  startIcon={<SendIcon />}
                  sx={{
                    padding: "10px 20px",
                    borderRadius: "20px",
                    textTransform: "none",
                    backgroundColor: "#008060",
                    "&:hover": { backgroundColor: "#600080" },
                  }}
                >
                  Send
                </Button>
              </Box>
            </>
          ) : (
            <Typography
              variant="h6"
              color="textSecondary"
              align="center"
              sx={{ marginTop: "20%" }}
            >
              Select a conversation to start chatting.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
