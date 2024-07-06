package com.cac.Movies.db;

import java.sql.*;

public class Conexion {
    public String driver="com.mysql.cj.jdbc.Driver";

    public Connection getConnection() throws ClassNotFoundException
    {
        Connection conexion = null;
        try {
            Class.forName(driver);
            String url = "jdbc:mysql://localhost:3306/cac_movies";
            conexion = DriverManager.getConnection(url, "root", "");
        } catch (SQLException var3) {
            SQLException e = var3;
            System.out.println("Hay un error:" + String.valueOf(e));
        }
        return conexion;
    }
}
