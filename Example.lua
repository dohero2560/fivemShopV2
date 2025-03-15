local function verifyIP()
    local serverIP = GetConvar("sv_endpoint", "")
    -- ตัดเอาเฉพาะ IP address
    serverIP = string.match(serverIP, "([^:]+)")
    
    PerformHttpRequest("https://your-website.com/api/server-ips/verify", function(err, text, headers)
        if err == 403 then
            print("^1[ERROR] IP ไม่ถูกต้อง กรุณาตรวจสอบการตั้งค่า IP ในเว็บไซต์^7")
            StopResource(GetCurrentResourceName())
        elseif err ~= 200 then
            print("^1[ERROR] ไม่สามารถยืนยัน IP ได้^7")
            StopResource(GetCurrentResourceName())
        end
    end, "PATCH", json.encode({
        resourceName = GetCurrentResourceName(),
        ipAddress = serverIP,
        serverIdentifier = GetConvar("sv_licenseKey", "unknown")
    }), { ["Content-Type"] = "application/json" })
end

AddEventHandler('onResourceStart', function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
        return
    end
    verifyIP()
end)