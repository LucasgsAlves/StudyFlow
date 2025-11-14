package br.app.studyflow.studyflow.services;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Arrays;

public class CookieService {

    // Criar cookie
    public static void setCookie(HttpServletResponse response, String key, String value, int segundos) throws UnsupportedEncodingException {
        Cookie cookie = new Cookie(key, URLEncoder.encode(value, "UTF-8"));
        cookie.setMaxAge(segundos);
        cookie.setPath("/"); // boa prática
        response.addCookie(cookie);
    }

    // Ler cookie
    public static String getCookie(HttpServletRequest request, String key) {
        if (request.getCookies() == null) {
            return null;
        }

        return Arrays.stream(request.getCookies())
                .filter(c -> c.getName().equals(key))
                .findFirst()
                .map(cookie -> {
                    try {
                        return URLDecoder.decode(cookie.getValue(), "UTF-8");
                    } catch (UnsupportedEncodingException e) {
                        return null;
                    }
                })
                .orElse(null);
    }
}
