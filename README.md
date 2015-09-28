# mod1
 Adaptation &amp; creativity, Algorithms &amp; AI, Graphics, Group &amp; interpersonal

note finale :
111 / 100

Ce projet consiste à réaliser une simulation terrestre puis hydrodynamique.
A partir d’un jeu de données très réduit, vous allez dans un premier temps extrapoler une
surface plus ou moins réaliste représentant un paysage. Ensuite, ce paysage étant défini,
il va être recouvert d’eau, sous plusieurs formes.

Votre programme va prendre en paramètre au moins un fichier externe (d’extension
.mod1) qui contient les informations minimum dont vous disposez. Il s’agit d’une série
de coordonées en 3 dimensions. Elles definissent quelques points éparses par lesquels doit
impérativement passer la surface du paysage. Le fichier n’a pas de limite concernant le
nombre de points. 5, 10 ou 20 points par exemples. Ce qui est sur c’est que un fichier qui
contient plus d’un cinquantaine de points, c’est hors sujet. On est pas en train de faire
un fdf.

Votre premier job, c’est de representer une surface pleine qui passe par ces points
là. Cloisonnez le tout dans l’espace, tels des reliefs en sable dans un cube transparent.
Tout le pourtour de cette surface doit avoir une altitude nulle. Cette surface ne doit pas
contenir d’arête (à nouveau, on n’est pas en train de faire un fdf), mais être arrondie
de partout. Du coup, un peu d’algo en perspective, à la fois pour délimiter l’échelle, les
limites de votre espace, et pour calculer la surface. Des méthodes connues existent, cela
peut vous servir de piste.

Votre second job, c’est de mettre de l’eau de partout. La présence d’eau, son écoulement,
sa répartition sur le paysage doit paraitre logique et naturelle. Au moins trois
différents scénarios doivent être présents :

• une montée des eaux uniforme sur l’ensemble de la surface, recouvrant petit à petit
les terrains les plus bas et laissant ceux en altitude.
• une vague qui arrive sur un coté et qui submerge graduellement l’ensemble.
• de la pluie vient s’abattre sur ce joli paysage et l’innonde au fil du temps.

Vous devez effectuer une représentation graphique de la surface, ainsi que de l’eau qui
s’y trouve et de ses mouvements. Il n’y a pas de contrainte particulière sur les outils ou
librairies utilisées pour le dessin. La minilibX suffit largement, mais vous pouvez utiliser
SDL, ou faire de l’OpenGL si ça vous chante (ou du QT, ou du GTK, etc..). Souvenez vous qu’il s’agit avant tout d’un projet d’algorithmique. Le rendu graphique doit permettre
sans ambiguité de voir que les fonctionnalités demandées sont présentes, il doit
donc être de qualité suffisante, mais une super interface ne vous rapportera que des points
bonus.
