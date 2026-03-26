import { MenuList, MenuItem, Text, Divider } from "@chakra-ui/react"

type Props = {
  name?: string
  onLogoutClick: () => void
  isDisabled: boolean
  access?: string
}

const ProfileMenuList = ({ name = "User", onLogoutClick, isDisabled, access = "none" }: Props) => {
  return (
    <MenuList 
      bg="#3A3B47" 
      border="none" 
      borderRadius="12px" 
      p="8px" 
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)"
      minW="200px"
    >
      <Text color="white" bg="#625e5eff" borderRadius="10px" marginY="10px" px={3} py={2} fontSize="sm" fontWeight="500">
        Hello, {name}
      </Text>
      <Text color="gray.300" bg="#625e5eff" borderRadius="10px" marginY="10px" px={3} py={1} fontSize="xs">
        Logged In as: {access}
      </Text>
      <Divider my={2} borderColor="gray.600" />
      <MenuItem 
      style={{
        display: "flex",
        justifyContent: "center",
        height:"50px" 
      }}
        onClick={onLogoutClick} 
        bg="#eb4949ff"
        color="white"
        isDisabled={isDisabled}
        _hover={{ 
          bg: "red.500",
          border: "1px solid white"
        }}
        _active={{
          bg: "red.600"
        }}
        borderRadius="6px"
        fontSize="sm"
        transition="all 0.2s ease"
      >
        Logout
      </MenuItem>
    </MenuList>
  )
}

export default ProfileMenuList