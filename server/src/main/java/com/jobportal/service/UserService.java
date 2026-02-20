package com.jobportal.service;

import com.jobportal.dto.LoginDTO;
import com.jobportal.dto.ResponseDTO;
import com.jobportal.dto.UserDTO;
import com.jobportal.exception.JobPortalExceeption;

public interface UserService {

    UserDTO registerUser(UserDTO userDTO) throws JobPortalExceeption;

    UserDTO loginUser(LoginDTO loginDTO) throws JobPortalExceeption;

    public Boolean sendOtp(String email) throws Exception;

    public Boolean verifyOtp(String email, String otp) throws JobPortalExceeption;

    public ResponseDTO changePassword(LoginDTO loginDTO) throws JobPortalExceeption;

}
