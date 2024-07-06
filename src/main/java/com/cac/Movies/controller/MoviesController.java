package com.cac.Movies.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.*;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import com.cac.Movies.service.*;
import com.cac.Movies.entity.*;

@WebServlet("/movies/*")
public class MoviesController extends HttpServlet {
    private MovieService movieService;
    private ObjectMapper objectMapper;

    //private final PeliculaService peliculaService;
    @Override
    public void init() throws ServletException
    {
        movieService = new MovieService();
        objectMapper = new ObjectMapper();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
        String pathInfo=req.getPathInfo();
        try {
            // si la url es la raiz ("/"), devuelve todas las peliculas
            if(pathInfo==null || pathInfo.equals("/")) {
                List<Movie> movies=movieService.getAllMovies();
                String json=objectMapper.writeValueAsString(movies);
                resp.setContentType("application/json");
                resp.getWriter().write(json);
            }
            else // si no es la ruta raiz ("/"), tratar de obtener el ID del url.
            {
                // separar req.url por cada "/"
                String[] pathParts=pathInfo.split("/");
                int id=Integer.parseInt(pathParts[1]);
                Movie movie=movieService.getMoviesById(id);

                if(movie!=null) {
                    String json=objectMapper.writeValueAsString(movie);
                    resp.setContentType("application/json");
                    resp.getWriter().write(json);
                }
                else // si no es la ruta raiz y tampoco encuentra el id, devuelve error
                {
                    throw new ServletException();
                }

            }

        } catch(SQLException | ClassNotFoundException e) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);

        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            Movie pelicula = objectMapper.readValue(req.getReader(),Movie.class);
            movieService.addMovie(pelicula);
            resp.setStatus(HttpServletResponse.SC_CREATED);
        } catch(SQLException|ClassNotFoundException e) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);

        }
    }
}