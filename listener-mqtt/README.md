insLoop.py
===========
python program to insert into informix using the mqtt listener capabilities.  The schema of the table is (sensor_id integer, tstamp datetime year to fraction(5), d bson).  The publish topic uses <database>.<table>
	- Install python dependencies

insLoop.js
===========
node.js program to insert into informix using the mqtt listener capabilities.  The schema of the table is (sensor_id integer, tstamp datetime year to fraction(5), d bson).  The publish topic uses <database>.<table>
	- Install node module dependencies


insPicture.js
==============
node.js program to insert a picture (converted to base 64) into informix using the mqtt listener capabilities.  The schema of the table is (col1 integer, data bson).  The publish topic uses <database>.<table>
	- Install node module dependencies



	
