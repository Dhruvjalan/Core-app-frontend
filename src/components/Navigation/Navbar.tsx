import axios from "./../../utils/_axios";
import { Flex, Image } from "antd"
import { useNavigate } from "react-router-dom"
import { Button, Avatar, Box, Menu, MenuButton } from "@chakra-ui/react"
import ProfileMenuList from "./MenuList"
// import { useDisclosure } from "@chakra-ui/react"
import { logout } from "../../utils/authHandler"
import { useState, useEffect } from "react"
import members from "../../utils/MemberInfo.json"

const Navbar = () => {
  const navigate = useNavigate()
  const [access, setAccess] = useState<string>("")
  const [name, setName] = useState<string>("")
  // const [email, setEmail] = useState<string>("")
  // const [vertical, setVertical] = useState<string>('');

  // const { onOpen, onClose, isOpen } = useDisclosure()
  const [isDisabled, setIsDisabled] = useState(false)

  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") return "U"
    const parts = name.trim().split(" ").filter(Boolean)
    if (parts.length === 0) return "U"
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }

  // useEffect(() => {

  //   // frontend cookie here
  //   const token = Cookies.get("wedonttellsuchthings")
  //   const access_cookie = Cookies.get("ACCESS")

  //   if (!token || !access_cookie) {
  //     navigate("/login")
  //     return
  //   }

  //   try {
  //     const payload = JSON.parse(atob(token.split(".")[1]))
  //     const emailFromToken = payload.email
  //     const pattern = /^([a-z]{2}\d{2}[a-z]\d{3})@smail\.iitm\.ac\.in$/
  //     const match = emailFromToken.toLowerCase().match(pattern)

  //     if (!match) {
  //       navigate("/login")
  //       return
  //     }

  //     const roll = match[1].toUpperCase()
  //     const member = members.find((m) => m.roll.toUpperCase() === roll)

  //     if (!member) {
  //       navigate("/login")
  //       return
  //     }

  //     setName(member.name)
  //     // setEmail(emailFromToken)
  //     // setVertical(member.vertical)
  //     setAccess(access_cookie)

  //   } catch {
  //     navigate("/login")
  //   }
  // }, [navigate])

  // const handleLogoutClick = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault()
  //   setIsDisabled(true)
  //   const logOutSuccess = await logout()
  //   setIsDisabled(false)

  //   if (logOutSuccess) {
  //     navigate("/login")
  //   }
  // }

  useEffect(() => {
    const authenticateUser = async () => {
      let token = null;
      let access_cookie = null;

      // 1. Fetch Cookies from Backend
      try {
        const tokenRes = await axios.post(
          '/getcookie',
          { cookieattr: "wedonttellsuchthings" },
          { withCredentials: true }
        );
        token = tokenRes.data;

        const accessRes = await axios.post(
          '/getcookie',
          { cookieattr: "ACCESS" },
          { withCredentials: true }
        );
        access_cookie = accessRes.data;

      } catch (error) {
        console.error("Failed to fetch auth cookies from backend", error);
        navigate("/login");
        return;
      }

      // 2. Validate existence
      if (!token || !access_cookie) {
        navigate("/login");
        return;
      }

      // 3. Decode and Validate Logic (Existing)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const emailFromToken = payload.email;
        const pattern = /^([a-z]{2}\d{2}[a-z]\d{3})@smail\.iitm\.ac\.in$/;
        const match = emailFromToken.toLowerCase().match(pattern);

        if (!match) {
          navigate("/login");
          return;
        }

        const roll = match[1].toUpperCase();
        const member = members.find((m: any) => m.roll.toUpperCase() === roll);

        if (!member) {
          navigate("/login");
          return;
        }

        // 4. Set State
        setName(member.name);
        // setEmail(emailFromToken);
        // setVertical(member.vertical);
        setAccess(access_cookie);

      } catch (error) {
        console.error("Token validation failed", error);
        navigate("/login");
      }
    };

    authenticateUser();
  }, [navigate]);


  const handleLogoutClick = async () => {
    // No 'event' or 'event.preventDefault()' needed
    setIsDisabled(true)
    const logOutSuccess = await logout()
    setIsDisabled(false)

    if (logOutSuccess) {
        navigate("/login")
    }
}

  return (
    
      <Flex
    justify="space-between"
    align="center"
    
    style={{
        width: "100%",
        height: "64px",
        backgroundColor: "#1F2029",
        paddingLeft: "24px",
        paddingRight: "24px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
        position: "sticky",
        top: "0",
        zIndex: "1000",
    }}
>

      <Flex align="center" gap="24px">
        <Image
          src="/src/assets/navbarlogo.svg"
          preview={false}
          width={100}
          style={{ 
            cursor: "pointer",
            filter: "brightness(0) invert(1)",
            padding: '0.5rem'
          }}
          onClick={() => navigate("/dashboard")}
        />
      </Flex>

      <Box>
        <Menu>
          <MenuButton
            as={Button}
            borderRadius="24px"
            p="0"
            w="48px"
            h="48px"
            bg="#3A3B47"
            _hover={{ bg: "#4A4B57" }}
            _active={{ bg: "#4A4B57" }}
            transition="all 0.2s ease"
          >
            <Avatar
              name={getInitials(name)}
              size="sm"
              color="white"
              fontWeight="bold"
              borderRadius="24px"
              fontSize="md"
              bg="#5D5FEF"
            >
              {getInitials(name)}
            </Avatar>
          </MenuButton>

          <ProfileMenuList
            name={name}
            access={access}
            onLogoutClick={handleLogoutClick}
            isDisabled={isDisabled}
          />
        </Menu>
      </Box>
    </Flex>
  )
}

export default Navbar
