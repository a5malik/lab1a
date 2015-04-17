# tsleeve-a1 
(Akash Malik, 704332974)
I have done extra credit parts 1 and 2.
( i have instanced all the 8 cubes from one cubes date by applying translations and also
drawn each cube using one triangle strip. I also shrink and grow the cubes periodically by 1.1 and 0.9 by using a cosine function 
for the component of the scale matrix. I also rotate the cubes by 6 degrees each frame
( because setInterval (render,1000/60) renders at 60 fps, and 6 degrees each frame * 60 = 360 degrees = 1 rotation
 per sec = 60 rotations per minute.))
 (you can look in the render() function for details)